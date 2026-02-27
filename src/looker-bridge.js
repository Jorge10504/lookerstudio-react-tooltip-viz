/* global dscc */
export function subscribe(onData) {
  if (typeof dscc === "undefined") {
    console.warn("Mock mode enabled (running outside Looker Studio)");

    // Mock data for local dev
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

    return;
  }

  dscc.subscribeToData(
    (message) => onData(message),
    { transform: dscc.objectTransform }
  );
}