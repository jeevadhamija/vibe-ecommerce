require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const CartItem = require('./models/CartItem');
const Receipt = require('./models/Receipt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mockecom';
const PORT = process.env.PORT || 5000;

async function connectDB(){
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}

// Hardcoded products to seed on first run
const HARDCODED_PRODUCTS = [
  { sku: 'p1', name: 'Vibe Sneakers', price: 49.99, image: '/images/sneakers.jpg', description: 'Comfortable everyday sneakers' },
  { sku: 'p2', name: 'Chill Hoodie', price: 39.50, image: '/images/hoodie.jpg', description: 'Soft fleece hoodie' },
  { sku: 'p3', name: 'Minimal Backpack', price: 59.00, image: '/images/backpack.jpg', description: 'Sleek daypack' },
  { sku: 'p4', name: 'Water Bottle', price: 12.00, image: '/images/bottle.jpg', description: 'Insulated bottle' },
  { sku: 'p5', name: 'Wireless Earbuds', price: 79.99, image: '/images/earbuds.jpg', description: 'Noise-isolating earbuds' },
  { sku: 'p6', name: 'Crew Socks (3 pack)', price: 9.99, image: '/images/socks.jpg', description: 'Comfort fit socks' }
];

async function seedProductsIfNeeded(){
  const count = await Product.countDocuments();
  if (count === 0){
    console.log('Seeding products into MongoDB...');
    const docs = HARDCODED_PRODUCTS.map(p => ({ sku: p.sku, name: p.name, price: p.price, image: p.image, description: p.description }));
    await Product.insertMany(docs);
    console.log('Seed complete.');
  } else {
    console.log('Products exist in DB, skipping seed.');
  }
}

async function start(){
  await connectDB();
  await seedProductsIfNeeded();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use('/images', express.static(__dirname + '/public/images'));

  // GET /api/products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find().select('-__v').lean();
      res.json(products.map(p => ({ id: p._id, sku: p.sku, name: p.name, price: p.price, image: p.image, description: p.description })));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // GET /api/cart
  app.get('/api/cart', async (req, res) => {
    try {
      const items = await CartItem.find().populate('product').lean();
      const mapped = items.map(i => ({ id: i._id, productId: i.product._id, name: i.product.name, price: i.product.price, qty: i.qty }));
      const total = mapped.reduce((s, it) => s + it.price * it.qty, 0);
      res.json({ items: mapped, total });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // POST /api/cart { productId, qty }
  app.post('/api/cart', async (req, res) => {
    try {
      const { productId, qty } = req.body;
      if (!productId || !qty || qty < 1) return res.status(400).json({ error: 'invalid body' });
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: 'product not found' });

      let existing = await CartItem.findOne({ product: productId });
      if (existing) {
        existing.qty += qty;
        await existing.save();
        return res.json({ id: existing._id, productId, qty: existing.qty });
      } else {
        const item = new CartItem({ product: productId, qty });
        await item.save();
        return res.status(201).json({ id: item._id, productId, qty: item.qty });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // PATCH /api/cart/:id { qty }
  app.patch('/api/cart/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { qty } = req.body;
      if (typeof qty !== 'number' || qty < 0) return res.status(400).json({ error: 'invalid qty' });
      const item = await CartItem.findById(id);
      if (!item) return res.status(404).json({ error: 'cart item not found' });
      if (qty === 0) {
        await item.deleteOne();
        return res.json({ success: true });
      }
      item.qty = qty;
      await item.save();
      res.json({ id: item._id, productId: item.product, qty: item.qty });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // DELETE /api/cart/:id
  app.delete('/api/cart/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const result = await CartItem.findByIdAndDelete(id);
      if (!result) return res.status(404).json({ error: 'not found' });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // POST /api/checkout { cartItems, name, email }
  app.post('/api/checkout', async (req, res) => {
    try {
      const { cartItems, name, email } = req.body;
      if (!Array.isArray(cartItems) || !name || !email) return res.status(400).json({ error: 'invalid body' });

      // compute total securely from DB
      const ids = cartItems.map(ci => ci.productId);
      const products = await Product.find({ _id: { $in: ids } }).lean();
      const priceMap = new Map(products.map(p => [String(p._id), p.price]));
      let total = 0;
      const items = cartItems.map(ci => {
        const price = priceMap.get(String(ci.productId)) || 0;
        total += price * ci.qty;
        return { product: { id: ci.productId, price }, qty: ci.qty };
      });

      const receipt = new Receipt({ name, email, items, total });
      await receipt.save();

      // clear cart
      await CartItem.deleteMany({});

      res.json({ receipt: { id: receipt._id, name: receipt.name, email: receipt.email, items: receipt.items, total: receipt.total, createdAt: receipt.createdAt } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // health
  app.get('/health', (req, res) => res.json({ ok: true }));

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => { console.error('Startup error', err); process.exit(1); });
