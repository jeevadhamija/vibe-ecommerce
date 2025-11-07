import React, { useState } from 'react';

export default function CheckoutModal({ onClose, onSubmit, receipt }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (receipt) {
    return (
      <div className="modal">
        <div className="modal-card slide-down">
          <h3>Receipt</h3>
          <div className="r-row"><strong>ID:</strong> {receipt.id}</div>
          <div className="r-row"><strong>Total:</strong> ${receipt.total.toFixed(2)}</div>
          <div className="r-row"><strong>When:</strong> {new Date(receipt.createdAt).toLocaleString()}</div>
          <pre className="receipt-items">{JSON.stringify(receipt.items, null, 2)}</pre>
          <div className="modal-actions">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-card slide-down">
        <h3>Checkout</h3>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <div className="modal-actions">
          <button onClick={() => onSubmit({ name, email })} disabled={!name || !email}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
