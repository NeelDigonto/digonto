import { Engine } from "@/core/Engine";

declare global {
  interface Window {
    engine: Engine;
  }
}

export const isBrowser = typeof window !== "undefined";
export const isServer = typeof window === "undefined";
export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";
// export const isMobile = isBrowser && /Mobi|Android/i.test(navigator.userAgent);
// export const isIOS =
//   isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
// export const isMac =
//   isBrowser && /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
// export const isWindows = isBrowser && /Windows/.test(navigator.userAgent);
// export const isLinux = isBrowser && /Linux/.test(navigator.userAgent);
// export const isTouchDevice =
//   isBrowser && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
// export const isDarkMode =
//   isBrowser && window.matchMedia("(prefers-color-scheme: dark)").matches;
// export const isLightMode =
//   isBrowser && window.matchMedia("(prefers-color-scheme: light)").matches;
// export const isWebGLSupported = isBrowser && !!window.WebGLRenderingContext;
// export const isWebAssemblySupported = isBrowser && !!window.WebAssembly;
// export const isServiceWorkerSupported =
//   isBrowser && "serviceWorker" in navigator;
// export const isLocalStorageSupported = isBrowser && "localStorage" in window;
// export const isSessionStorageSupported =
//   isBrowser && "sessionStorage" in window;
// export const isIndexedDBSupported = isBrowser && "indexedDB" in window;
// export const isWebSocketSupported = isBrowser && "WebSocket" in window;
// export const isFetchSupported = isBrowser && "fetch" in window;
//
