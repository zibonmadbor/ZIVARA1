const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Global settings
  storeName: {
    type: String,
    default: 'ZIVARA'
  },
  contactEmail: {
    type: String,
    default: 'support@zivara.com'
  },
  
  // Payment Settings
  bkashMerchantNumber: {
    type: String,
    default: '+8801751602201'
  },
  
  // Top Notification Bar
  notificationActive: {
    type: Boolean,
    default: true
  },
  notificationText: {
    type: String,
    default: 'Free shipping on all orders over $150'
  },
  notificationLink: {
    type: String,
    default: '/products'
  },

  // Flash Sale configuration
  flashSaleActive: {
    type: Boolean,
    default: false
  },
  flashSaleTitle: {
    type: String,
    default: 'Summer Flash Sale'
  },
  flashSaleDiscount: {
    type: String,
    default: 'Up to 50% Off'
  },
  flashSaleEndTime: {
    type: Date,
    default: null
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
