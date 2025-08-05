// Minimal ambient typings for the `paypal-js` SDK exposed on `window.paypal`.

/* eslint-disable @typescript-eslint/no-explicit-any */

export {}; // this file is a module

declare global {
  interface Window {
    paypal: any;
  }
}
