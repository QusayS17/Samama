// src/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI?: {
      send: (channel: string, data?: unknown) => void;
      receive: (channel: string, func: (...args: any[]) => void) => void;
    };
  }
}
