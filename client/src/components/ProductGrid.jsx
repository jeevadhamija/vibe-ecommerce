import React from "react";

export default function ProductGrid({ products = [], onAdd }) {
  return (
    <section className="products">
      {products.map((p) => (
        <article className="card" key={p.id} aria-label={p.name}>
          <div className="card-media"></div>
          <div className="card-body">
            <h3 className="card-title">{p.name}</h3>
            <p className="card-desc">{p.description}</p>
            <div className="card-row">
              <div className="price">${p.price.toFixed(2)}</div>
              <button className="btn" onClick={() => onAdd(p.id)}>
                Add
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
