const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  qty: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
