// looker-bridge.js
const DSCC_URL = "https://www.gstatic.com/datastudio/visualization/dscc.min.js";

function loadDsccScript() {
  return new Promise((resolve, reject) => {
    // already loaded
    if (window.dscc) return resolve(window.dscc);

    // already loading?
    const existing = document.querySelector(`script[src="${DSCC_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.dscc));
      existing.addEventListener("error", reject);
      return;
    }

    const s = document.createElement("script");
    s.src = DSCC_URL;
    s.async = true;
    s.onload = () => resolve(window.dscc);
    s.onerror = () => reject(new Error("Failed to load dscc library"));
    document.head.appendChild(s);
  });
}

export async function subscribe(onData) {
  try {
    const dscc = await loadDsccScript();

    // ✅ Real Looker Studio data
    dscc.subscribeToData(
      (message) => onData(message),
      { transform: dscc.objectTransform }
    );
  } catch (err) {
    console.warn("Falling back to mock mode:", err);

    // Mock data for local dev
    onData({
      tables: {
        DEFAULT: [
          {
            name: { value: "Product A" },
            image: { value: "https://images.pexels.com/photos/7897470/pexels-photo-7897470.jpeg?cs=srgb&dl=pexels-frostroomhead-7897470.jpg&fm=jpg" },
            price: { value: 120 },
            inventory: { value: 45 },
          },
          {
            name: { value: "Product B" },
            image: { value: "https://img.freepik.com/premium-photo/white-stage-background-pedestal-podium-product-display-show-product-purple-background-3d_796580-1137.jpg" },
            price: { value: 300 },
            inventory: { value: 12 },
          },
        ],
      },
      style: {
        tooltip: {
          bgColor: { value: "#111111" },
          textColor: { value: "#ffffff" },
        },
      },
    });
  }
}