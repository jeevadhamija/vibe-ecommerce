const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  sku: { type: String, unique: true },
  name: String,
  price: Number,
  image: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
