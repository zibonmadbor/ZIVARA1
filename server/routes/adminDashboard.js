const express = require('express');
const router = express.Router();
const { protect, adminOnly, moderatorOnly } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @route   GET /api/admin/dashboard
// @desc    Get dashboard analytics
// @access  Private/Admin
router.get('/', protect, moderatorOnly, async (req, res) => {
  try {
    // 1. Total Revenue (sum of all orders)
    const revenueAggregation = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Total Customers (role: customer)
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 4. Total Products
    const totalProducts = await Product.countDocuments();

    // 5. Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 6. Sales Chart Data (Last 7 days mock for now, or real aggregation)
    // To make it simple but real, we'll get orders from the last 7 days grouped by date
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesAggregation = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: '$total' }
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    // Format for charts
    const salesData = salesAggregation.map(item => ({
      name: item._id,
      sales: item.sales
    }));

    const revenueData = salesAggregation.map(item => ({
      name: item._id,
      revenue: item.revenue
    }));

    // If no sales in last 7 days, provide empty default
    if (salesData.length === 0) {
      salesData.push({ name: 'Today', sales: 0 });
      revenueData.push({ name: 'Today', revenue: 0 });
    }

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      salesData,
      revenueData
    });
  } catch (error) {
    console.error('Dashboard Analytics Error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

module.exports = router;
