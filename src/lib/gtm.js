
// lib/gtm.js
export const pushToDataLayer = (event, data = {}) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: event,
      ...data,
    });
  }
};