// seed.js — optional manual seeding script (uses HARDCODED_PRODUCTS from server.js logic)
const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mockecom";

const HARDCODED_PRODUCTS = [
  {
    sku: "p1",
    name: "Vibe Sneakers",
    price: 50,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/399844/03/sv01/fnd/IND/fmt/png/Court-Shatter-Low-Sneakers",
    description: "Comfortable everyday sneakers",
  },
  {
    sku: "p2",
    name: "Chill Hoodie",
    price: 39.5,
    image: "/images/hoodie.jpg",
    description: "Soft fleece hoodie",
  },
  {
    sku: "p3",
    name: "Minimal Backpack",
    price: 59.0,
    image: "/images/backpack.jpg",
    description: "Sleek daypack",
  },
  {
    sku: "p4",
    name: "Water Bottle",
    price: 12.0,
    image: "/images/bottle.jpg",
    description: "Insulated bottle",
  },
  {
    sku: "p5",
    name: "Wireless Earbuds",
    price: 79.99,
    image: "/images/earbuds.jpg",
    description: "Noise-isolating earbuds",
  },
  {
    sku: "p6",
    name: "Crew Socks (3 pack)",
    price: 9.99,
    image: "/images/socks.jpg",
    description: "Comfort fit socks",
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(HARDCODED_PRODUCTS);
    console.log("Seeded products");
  } else {
    console.log("Products exist, skipping");
  }
  process.exit(0);
}
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
