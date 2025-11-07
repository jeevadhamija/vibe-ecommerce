import React from 'react';

export default function Cart({ data = {items:[], total:0}, onRemove, onUpdateQty, onCheckout }){
  const { items = [], total = 0 } = data;
  return (
    <aside className="cart">
      <h2>Cart</h2>
      {items.length === 0 ? <div className="empty">Your cart is empty</div> : (
        <ul className="cart-list">
          {items.map(it => (
            <li key={it.id} className="cart-row">
              <div className="cart-left">
                <div className="cart-name">{it.name}</div>
                <div className="cart-price">${(it.price * it.qty).toFixed(2)}</div>
              </div>
              <div className="cart-right">
                <div className="qty-controls">
                  <button onClick={() => onUpdateQty(it.id, Math.max(0, it.qty - 1))}>−</button>
                  <div className="qty">{it.qty}</div>
                  <button onClick={() => onUpdateQty(it.id, it.qty + 1)}>+</button>
                </div>
                <button className="remove" onClick={() => onRemove(it.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="cart-footer">
        <div className="total">Total: <strong>${total.toFixed(2)}</strong></div>
        <button className="checkout" onClick={onCheckout} disabled={items.length===0}>Checkout</button>
      </div>
    </aside>
  );
}
