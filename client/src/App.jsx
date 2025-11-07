import React, { useEffect, useState } from "react";
import API from "./api";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import Navbar from "./components/Navbar";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  async function fetchProducts() {
    try {
      const res = await API.get("/api/products");
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchCart() {
    try {
      const res = await API.get("/api/cart");
      setCart(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function addToCart(productId, qty = 1) {
    try {
      await API.post("/api/cart", { productId, qty });
      await fetchCart();
    } catch (e) {
      console.error(e);
      alert("Add failed");
    }
  }

  async function removeFromCart(cartId) {
    try {
      await API.delete(`/api/cart/${cartId}`);
      await fetchCart();
    } catch (e) {
      console.error(e);
    }
  }

  async function updateQty(cartId, qty) {
    try {
      await API.patch(`/api/cart/${cartId}`, { qty });
      await fetchCart();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCheckout(form) {
    try {
      const payload = {
        cartItems: cart.items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
        })),
        ...form,
      };
      const res = await API.post("/api/checkout", payload);
      setReceipt(res.data.receipt);
      setShowCheckout(true);
      await fetchCart();
    } catch (e) {
      console.error(e);
      alert("Checkout failed");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <header className="topbar">
          <div className="brand"></div>
        </header>

        <main className="main">
          <ProductGrid products={products} onAdd={addToCart} />
          <Cart
            data={cart}
            onRemove={removeFromCart}
            onUpdateQty={updateQty}
            onCheckout={() => setShowCheckout(true)}
          />
        </main>

        {showCheckout && (
          <CheckoutModal
            onClose={() => {
              setShowCheckout(false);
              setReceipt(null);
            }}
            onSubmit={handleCheckout}
            receipt={receipt}
          />
        )}
      </div>
    </>
  );
}
