import "@testing-library/jest-dom";
//ChatGPT was used to help generate this code 

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = class TextEncoder {
    encode(): Uint8Array {
      return new Uint8Array();
    }
  } as typeof TextEncoder;
}

if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = class TextDecoder {
    decode(): string {
      return "";
    }
  } as typeof TextDecoder;
}

if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = function <T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  } as <T>(value: T) => T;
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      void callback; // Mark as used
    }

    observe(target: Element) {
      void target; // Mark as used
    }

    unobserve(target: Element) {
      void target; // Mark as used
    }

    disconnect() {}
  } as typeof ResizeObserver;
}


