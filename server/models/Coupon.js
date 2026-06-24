const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discount_type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discount_value: {
    type: Number,
    required: true,
    min: 0
  },
  min_order_amount: {
    type: Number,
    default: 0
  },
  valid_until: {
    type: Date,
    required: true
  },
  usage_limit: {
    type: Number,
    default: null // null means unlimited
  },
  times_used: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
