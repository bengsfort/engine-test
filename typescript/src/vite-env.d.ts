/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="vite/client" />

declare let ENGINE_RUNNING: boolean;

interface Window {
  ENGINE_RUNNING: boolean;
  PERF_STATS: import('./utils/performance').PerformanceMonitor;
}

interface Performance {
  memory: {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}
