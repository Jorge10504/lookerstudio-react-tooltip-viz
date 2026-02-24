/* global dscc */
export function subscribe(onData) {
  if (typeof dscc === "undefined") {
    console.warn("Mock mode enabled (running outside Looker Studio)");

    // Mock data for local dev
    onData({
      tables: {
        DEFAULT: [
          {
            label: { value: "Product A" },
            value: { value: 120 }
          },
          {
            label: { value: "Product B" },
            value: { value: 300 }
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