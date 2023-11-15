// export type RenderingWindow = {
//   canvas: HTMLCanvasElement;
//   context: CanvasRenderingContext2D;
//   pixelRatio: number;
//   outputWidth: number;
//   outputHeight: number;
// };

import { WebGLRenderer } from 'three';

// export const resizeWindow = (
//   canvas: HTMLCanvasElement,
//   width: number,
//   height: number,
// ): void => {
//   const { devicePixelRatio } = window;

//   canvas.width = width * devicePixelRatio;
//   canvas.height = height * devicePixelRatio;
//   canvas.style.width = `${width}px`;
//   canvas.style.height = `${height}px`;
// };

// export const createWindow = (): RenderingWindow => {
//   const { innerWidth, innerHeight, devicePixelRatio } = window;

//   const canvas = document.createElement('canvas') as HTMLCanvasElement;
//   const context = canvas.getContext('2d') as CanvasRenderingContext2D;

//   resizeWindow(canvas, innerWidth, innerHeight);
//   context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

//   return context;
// };

type WindowOpts = {
  width?: number;
  height?: number;
  fullScreen?: boolean;
};

const DefaultOpts: WindowOpts = {
  fullScreen: true,
};

export class GameWindow {
  public readonly context: WebGLRenderer;
  public readonly canvas: HTMLCanvasElement;

  public outputWidth: number;
  public outputHeight: number;

  public constructor(opts: WindowOpts = DefaultOpts) {
    if (!opts.fullScreen && !opts.height && !opts.width) {
      throw new Error('No initialization information provided to GameWindow!');
    }

    const { innerWidth, innerHeight, devicePixelRatio } = window;

    const width = opts.fullScreen ? innerWidth : opts.width ?? 0;
    const height = opts.fullScreen ? innerHeight : opts.height ?? 0;

    const context = new WebGLRenderer();
    context.setSize(width, height);
    context.setPixelRatio(devicePixelRatio);

    if (opts.fullScreen) {
      window.addEventListener('resize', this.#onWindowSizeChanged);
    }

    this.context = context;
    this.canvas = context.domElement;
    this.outputWidth = width;
    this.outputHeight = height;
  }

  #onWindowSizeChanged = () => {
    const { innerWidth, innerHeight, devicePixelRatio } = window;

    this.context.setSize(innerWidth, innerHeight);
    this.context.setPixelRatio(devicePixelRatio);
    this.outputWidth = innerWidth;
    this.outputHeight = innerHeight;
  };
}
