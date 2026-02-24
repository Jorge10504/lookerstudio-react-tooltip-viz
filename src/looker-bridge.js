/* global dscc */
export function subscribe(onData) {
  // dscc is injected by Looker Studio runtime
  dscc.subscribeToData(
    (message) => onData(message),
    { transform: dscc.objectTransform }
  );
}