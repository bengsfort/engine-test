/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="vite/client" />

declare let ENGINE_RUNNING: boolean;

interface Window {
  ENGINE_RUNNING: boolean;
  PARTICLE_COUNT: number;
  SPAWNER_COUNT: number;
  PARTICLE_LIFETIME_SECS: number;
  PERF_STATS: import('./utils/performance').PerformanceMonitor;
}

interface Performance {
  memory: {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}
