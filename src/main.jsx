import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { subscribe } from "./looker-bridge";

function App() {
  const [msg, setMsg] = useState(null);
  const [hover, setHover] = useState(null); // { x, y, product }
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    subscribe(setMsg);
  }, []);

  const rows = useMemo(() => {
    if (!msg?.tables?.DEFAULT) return [];
    return msg.tables.DEFAULT.map((r) => ({
      name: r.name?.value ?? "",
      image: r.image?.value ?? "",
      price: r.price?.value ?? "",
      inventory: r.inventory?.value ?? ""
    }));
  }, [msg]);

  const bg = msg?.style?.tooltip?.bgColor?.value ?? "#111";
  const fg = msg?.style?.tooltip?.textColor?.value ?? "#fff";

  return (
    <div className="container">
      <div className="grid">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="card"
            onMouseMove={(e) => {
              setHover({
                x: e.clientX + 12,
                y: e.clientY + 12,
                product: r
              });
            }}
            onMouseLeave={() => setHover(null)}
            onClick={() => setSelected(r)}
          >
            <img src={r.image} alt={r.name} className="product-image" />
            <div className="product-name">{r.name}</div>
          </div>
        ))}
      </div>

      {/* FLOATING TOOLTIP (outside cards) */}
      {hover && !selected && (
        <div
          className="tooltip-floating"
          style={{
            left: hover.x,
            top: hover.y,
            background: bg,
            color: fg
          }}
        >
          <div><strong>{hover.product.name}</strong></div>
          <div>💲 Price: ${hover.product.price}</div>
          <div>📦 Stock: {hover.product.inventory}</div>
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setSelected(null)}>
              ✕
            </button>
            <img src={selected.image} alt={selected.name} />
            <h2>{selected.name}</h2>
            <p><strong>Price:</strong> ${selected.price}</p>
            <p><strong>Inventory:</strong> {selected.inventory}</p>
            <p>
              <strong>Status:</strong>{" "}
              {selected.inventory > 20 ? "In Stock" : "Low Stock"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);