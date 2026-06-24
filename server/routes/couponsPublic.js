const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// @route   GET /api/coupons/validate?code=XYZ
// @desc    Validate a coupon code
// @access  Public
router.get('/validate', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (!coupon.is_active) {
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    res.json({
      message: 'Coupon is valid',
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount
      }
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({ message: 'Server error validating coupon' });
  }
});

module.exports = router;
