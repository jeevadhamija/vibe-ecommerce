const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiptSchema = new Schema({
  name: String,
  email: String,
  items: [{ product: Schema.Types.Mixed, qty: Number }],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receipt', receiptSchema);
