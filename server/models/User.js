const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebase_uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: null
  },
  avatar_url: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  state: {
    type: String,
    default: null
  },
  zip_code: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'customer'],
    default: 'customer'
  },
  is_blocked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
