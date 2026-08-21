const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, default: null },
  color: { type: String, default: null },
  image: { type: String, default: null }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer_email: {
    type: String,
    required: true
  },
  customer_name: {
    type: String,
    required: true
  },
  customer_phone: {
    type: String,
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: [arr => arr.length > 0, 'Order must have at least one item']
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  invoice_number: {
    type: String,
    default: null
  },
  invoice_sent_at: {
    type: Date,
    default: null
  },
  shipping_address: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: null },
    zip_code: { type: String, default: null },
    country: { type: String, required: true }
  },
  payment_method: {
    type: String,
    enum: ['cod', 'bkash', 'card', 'nagad'],
    default: 'cod'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  payment_details: {
    transaction_id: { type: String, default: null },
    bkash_number: { type: String, default: null },
    paid_at: { type: Date, default: null }
  },
  order_status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
