let dsccRef = null;

function loadDscc() {
  return new Promise((resolve, reject) => {
    // If already loaded
    if (window.dscc) return resolve(window.dscc);

    // Inject the DSCC script
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/datastudio/visualization/dscc.min.js";
    script.async = true;

    script.onload = () => {
      if (!window.dscc) return reject(new Error("DSCC loaded but window.dscc missing"));
      resolve(window.dscc);
    };

    script.onerror = () => reject(new Error("Failed to load dscc.min.js"));

    document.head.appendChild(script);
  });
}

export async function subscribe(onData) {
  try {
    dsccRef = await loadDscc();

    dsccRef.subscribeToData(
      (message) => onData(message),
      { transform: dsccRef.objectTransform }
    );
  } catch (err) {
    console.warn("DSCC not available. Using mock data.", err);

    // Mock only as fallback (and optional)
    onData({
      tables: {
        DEFAULT: [
          {
            name: { value: "Product A" },
            image: { value: "https://images.pexels.com/photos/7897470/pexels-photo-7897470.jpeg?cs=srgb&dl=pexels-frostroomhead-7897470.jpg&fm=jpg" },
            price: { value: 120 },
            inventory: { value: 45 }
          },
          {
            name: { value: "Product B" },
            image: { value: "https://img.freepik.com/premium-photo/white-stage-background-pedestal-podium-product-display-show-product-purple-background-3d_796580-1137.jpg" },
            price: { value: 300 },
            inventory: { value: 12 }
          }
        ]
      },
      style: {
        tooltip: {
          bgColor: { value: "#111111" },
          textColor: { value: "#ffffff" }
        }
      }
    });
  }
}