const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect, moderatorOnly } = require('../middleware/auth');

// @route   GET /api/admin/coupons
// @desc    Get all coupons
// @access  Private/Admin
router.get('/', protect, moderatorOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching coupons' });
  }
});

// @route   POST /api/admin/coupons
// @desc    Create a coupon
// @access  Private/Admin
router.post('/', protect, moderatorOnly, async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_amount, valid_until, is_active } = req.body;
    
    // Check if code exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code,
      discount_type,
      discount_value,
      min_order_amount,
      valid_until,
      is_active
    });

    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating coupon' });
  }
});

// @route   PUT /api/admin/coupons/:id
// @desc    Update a coupon
// @access  Private/Admin
router.put('/:id', protect, moderatorOnly, async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_amount, valid_until, is_active } = req.body;
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    if (code && code.toUpperCase() !== coupon.code) {
       const existing = await Coupon.findOne({ code: code.toUpperCase() });
       if (existing) return res.status(400).json({ message: 'Coupon code already exists' });
       coupon.code = code.toUpperCase();
    }

    if (discount_type) coupon.discount_type = discount_type;
    if (discount_value !== undefined) coupon.discount_value = discount_value;
    if (min_order_amount !== undefined) coupon.min_order_amount = min_order_amount;
    if (valid_until) coupon.valid_until = valid_until;
    if (is_active !== undefined) coupon.is_active = is_active;

    await coupon.save();
    res.json({ message: 'Coupon updated successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating coupon' });
  }
});

// @route   DELETE /api/admin/coupons/:id
// @desc    Delete a coupon
// @access  Private/Admin
router.delete('/:id', protect, moderatorOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting coupon' });
  }
});

module.exports = router;
