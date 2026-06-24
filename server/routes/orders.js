const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly, moderatorOnly } = require('../middleware/auth');

// Generate unique order number
async function generateOrderNumber() {
  const count = await Order.countDocuments();
  const num = 1001 + count;
  return `ZIV-${num}`;
}

// @route   GET /api/orders
// @desc    Get all orders (Admin/Moderator only)
// @access  Private/Admin
router.get('/', protect, moderatorOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin/Moderator only)
// @access  Private/Admin
router.put('/:id/status', protect, moderatorOnly, async (req, res) => {
  try {
    const { order_status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.order_status = order_status;
    await order.save();
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

// @route   POST /api/orders
// @desc    Place a new order (Cash on Delivery)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please log in.' });
    }

    // Validate profile completion
    if (!user.phone) {
      return res.status(400).json({ message: 'Please add your phone number before placing an order.' });
    }
    if (!user.address || !user.city || !user.country) {
      return res.status(400).json({ message: 'Please complete your delivery address before placing an order.' });
    }

    const { items, notes, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    let appliedCouponDoc = null;

    if (couponCode) {
      const Coupon = require('../models/Coupon');
      appliedCouponDoc = await Coupon.findOne({ code: couponCode.toUpperCase(), is_active: true });
      if (appliedCouponDoc) {
        // Validate coupon conditions
        const isExpired = appliedCouponDoc.valid_until && new Date(appliedCouponDoc.valid_until) < new Date();
        const overLimit = appliedCouponDoc.usage_limit && appliedCouponDoc.times_used >= appliedCouponDoc.usage_limit;
        const meetsMinAmount = subtotal >= (appliedCouponDoc.min_order_amount || 0);

        if (!isExpired && !overLimit && meetsMinAmount) {
          if (appliedCouponDoc.discount_type === 'percentage') {
            discountAmount = subtotal * (appliedCouponDoc.discount_value / 100);
          } else if (appliedCouponDoc.discount_type === 'fixed') {
            discountAmount = Math.min(subtotal, appliedCouponDoc.discount_value);
          }
        }
      }
    }

    const shipping = 0; // Free shipping for now
    const total = Math.max(0, subtotal - discountAmount + shipping);

    const order_number = await generateOrderNumber();

    const order = new Order({
      order_number,
      customer: user._id,
      customer_email: user.email,
      customer_name: user.full_name,
      customer_phone: user.phone,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        image: item.image || null
      })),
      subtotal,
      shipping,
      total,
      shipping_address: {
        address: user.address,
        city: user.city,
        state: user.state || null,
        zip_code: user.zip_code || null,
        country: user.country
      },
      payment_method: 'cod',
      payment_status: 'pending',
      order_status: 'confirmed',
      notes: notes || null
    });

    await order.save();

    // Increment coupon usage if applied
    if (appliedCouponDoc && discountAmount > 0) {
      appliedCouponDoc.times_used += 1;
      await appliedCouponDoc.save();
    }

    const Notification = require('../models/Notification');
    await Notification.create({
      title: 'New Order Received',
      message: `Order ${order_number} placed by ${user.full_name} for $${total.toFixed(2)}.`,
      type: 'order',
      link: '/admin/orders'
    });

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: order._id,
        order_number: order.order_number,
        total: order.total,
        order_status: order.order_status,
        payment_method: order.payment_method,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged-in user's orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const orders = await Order.find({ customer: user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ orders });
  } catch (error) {
    console.error('Get My Orders Error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID (owner only)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const order = await Order.findById(req.params.id).lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Only allow owner or admin to view
    if (order.customer.toString() !== user._id.toString() &&
        user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get Order Error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

module.exports = router;
