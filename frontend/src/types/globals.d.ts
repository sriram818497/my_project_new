// src/types/global.d.ts
interface Window {
  initializeGA?: () => void;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
