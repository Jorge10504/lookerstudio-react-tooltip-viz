import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { subscribe } from "./looker-bridge";

function App() {
  const [msg, setMsg] = useState(null);
  const [hover, setHover] = useState(null); // {x,y,row}

  useEffect(() => {
    subscribe(setMsg);
  }, []);

  const rows = useMemo(() => {
    if (!msg?.tables?.DEFAULT) return [];
    const t = msg.tables.DEFAULT;
    // t is an array of rows, with dimension/metric fields already transformed
    return t.map((r) => ({
      label: r.label?.value ?? "",
      value: r.value?.value ?? ""
    }));
  }, [msg]);

  const bg = msg?.style?.tooltip?.bgColor?.value ?? "#111";
  const fg = msg?.style?.tooltip?.textColor?.value ?? "#fff";

  return (
    <div className="container">
      <h3 className="title">React Tooltip Viz</h3>

      <div className="list">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="row"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHover({
                x: e.clientX - rect.left + 12,
                y: e.clientY - rect.top + 12,
                row: r
              });
            }}
            onMouseLeave={() => setHover(null)}
          >
            <span>{r.label}</span>
            <span className="value">{r.value}</span>

            {hover?.row === r && (
              <div
                className="tooltip"
                style={{
                  left: hover.x,
                  top: hover.y,
                  background: bg,
                  color: fg
                }}
              >
                <div><strong>{r.label}</strong></div>
                <div>Value: {r.value}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!msg && <div className="hint">Waiting for Looker Studio data…</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);