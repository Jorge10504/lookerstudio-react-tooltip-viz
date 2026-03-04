import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { subscribe } from "./looker-bridge";

function App() {
  const [msg, setMsg] = useState(null);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      await subscribe(setMsg);
    })();
  }, []);

  /* -----------------------------
  Map Looker Studio rows
  ----------------------------- */

  const rows = useMemo(() => {
    if (!msg?.tables?.DEFAULT) return [];

    return msg.tables.DEFAULT.map((r) => ({
      name: r.name?.value ?? "",
      category: r.category?.value ?? "",
      image: r.image?.value ?? "",
      price: Number(r.price?.value ?? 0),
      stock: Number(r.inventory?.value ?? 0),
      sales: Number(r.sales?.value ?? 0),
      ranking: Number(r.ranking?.value ?? 0)
    }));
  }, [msg]);

  /* -----------------------------
  Sales totals
  ----------------------------- */

  const totalSalesAll = useMemo(() => {
    return rows.reduce((sum, r) => sum + r.sales, 0);
  }, [rows]);

  function getCategoryTotals(category) {
    const categoryRows = rows.filter((r) => r.category === category);

    const categorySales = categoryRows.reduce(
      (sum, r) => sum + r.sales,
      0
    );

    return { categoryRows, categorySales };
  }

  /* -----------------------------
  Guards
  ----------------------------- */

  if (!msg) {
    return <div style={{ padding: 12 }}>Waiting for Looker data...</div>;
  }

  if (!rows.length) {
    return (
      <pre style={{ padding: 12, fontSize: 12 }}>
        No rows received. {JSON.stringify(msg?.tables?.DEFAULT, null, 2)}
      </pre>
    );
  }

  const bg = msg?.style?.tooltip?.bgColor?.value ?? "#111";
  const fg = msg?.style?.tooltip?.textColor?.value ?? "#fff";

  return (
    <div className="container">

      {/* PRODUCT GRID */}

      <div className="grid">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="card"
            onMouseMove={(e) =>
              setHover({
                x: e.clientX + 12,
                y: e.clientY + 12,
                product: r
              })
            }
            onMouseLeave={() => setHover(null)}
            onClick={() => setSelected(r)}
          >
            <img src={r.image} alt={r.name} className="product-image" />
            <div className="product-name">{r.name}</div>
          </div>
        ))}
      </div>

      {/* ----------------------------------
      TOOLTIP
      ---------------------------------- */}

      {hover && !selected && (() => {

        const p = hover.product;

        const productSales = p.sales;

        const { categorySales } = getCategoryTotals(p.category);

        const productShare =
          categorySales > 0 ? productSales / categorySales : 0;

        const restShare = 1 - productShare;

        const productPct = Math.round(productShare * 100);
        const restPct = Math.round(restShare * 100);

        return (
          <div
            className="tooltip-floating"
            style={{
              left: hover.x,
              top: hover.y,
              "--tt-bg": bg,
              "--tt-fg": fg
            }}
          >

            {/* HEADER */}

            <div className="tt-header">
              <div className="tt-title">{p.name}</div>
              <div className="tt-subtitle">Category: {p.category}</div>
            </div>

            <div className="tt-divider" />

            {/* METRICS */}

            <div className="tt-content">

              <div className="tt-viz">
                <div className="tt-viz-title">Sales Performance</div>

                <div className="tt-row">
                  <span className="tt-key">Sales</span>
                  <span className="tt-val">
                    ${p.sales.toLocaleString()}
                  </span>
                </div>

                <div className="tt-row">
                  <span className="tt-key">Ranking</span>
                  <span className="tt-val">#{p.ranking}</span>
                </div>
              </div>

              <div className="tt-table">

                <div className="tt-row">
                  <span className="tt-key">Price</span>
                  <span className="tt-val">${p.price}</span>
                </div>

                <div className="tt-row">
                  <span className="tt-key">Stock</span>
                  <span className="tt-val">{p.stock}</span>
                </div>

                <div className="tt-row">
                  <span className="tt-key">Status</span>
                  <span className="tt-val">
                    {p.stock > 20
                      ? "🟢 In Stock"
                      : "🟡 Low Stock"}
                  </span>
                </div>

              </div>

            </div>

            {/* SHARE OF CATEGORY SALES */}

            <div className="tt-mini">

              <div className="tt-mini-title">
                Share of Category Sales
              </div>

              <div className="tt-bar-row">

                <span className="tt-bar-label">Product</span>

                <div className="tt-bar-track">
                  <div
                    className="tt-bar-fill"
                    style={{ width: `${productPct}%` }}
                  />
                </div>

                <span className="tt-bar-value">{productPct}%</span>

              </div>

              <div className="tt-bar-row">

                <span className="tt-bar-label">Rest of Category</span>

                <div className="tt-bar-track">
                  <div
                    className="tt-bar-fill rest"
                    style={{ width: `${restPct}%` }}
                  />
                </div>

                <span className="tt-bar-value">{restPct}%</span>

              </div>

              <div className="tt-mini-foot">
                Product Sales: ${productSales.toLocaleString()}
                <br />
                Category Sales: ${categorySales.toLocaleString()}
              </div>

            </div>

          </div>
        );

      })()}

      {/* ----------------------------------
      MODAL
      ---------------------------------- */}

      {selected && (
        <div className="modal-overlay">

          <div className="modal analytics-modal">

            <button
              className="close-btn"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            {/* HEADER */}

            <div className="modal-header">

              <img src={selected.image} alt={selected.name} />

              <div>
                <h2>{selected.name}</h2>
                <div className="modal-category">
                  {selected.category}
                </div>
              </div>

            </div>

            {/* METRICS */}

            <div className="modal-grid">

              <div className="modal-metric">
                <div className="metric-label">Sales</div>
                <div className="metric-value">
                  ${selected.sales.toLocaleString()}
                </div>
              </div>

              <div className="modal-metric">
                <div className="metric-label">Ranking</div>
                <div className="metric-value">
                  #{selected.ranking}
                </div>
              </div>

              <div className="modal-metric">
                <div className="metric-label">Price</div>
                <div className="metric-value">
                  ${selected.price}
                </div>
              </div>

              <div className="modal-metric">
                <div className="metric-label">Stock</div>
                <div className="metric-value">
                  {selected.stock}
                </div>
              </div>

            </div>

            <div className="modal-status">
              {selected.stock > 20
                ? "🟢 In Stock"
                : "🟡 Low Stock"}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ----------------------------------
Mount for Looker Studio iframe
---------------------------------- */

let mount = document.getElementById("root");

if (!mount) {

  mount = document.createElement("div");
  mount.id = "root";

  mount.style.width = "100%";
  mount.style.height = "100%";

  document.body.style.margin = "0";
  document.body.style.width = "100%";
  document.body.style.height = "100%";

  document.body.appendChild(mount);

}

ReactDOM.createRoot(mount).render(<App />);