import { WebGLRenderer } from 'three';

import { makeLoggers } from '../utils/logging';

const { info } = makeLoggers('GameWindow');

type WindowOpts = {
  width?: number;
  height?: number;
  fullScreen?: boolean;
};

type SizeChangedHandler = (width: number, height: number) => void;

const DefaultOpts: WindowOpts = {
  fullScreen: true,
};

export class GameWindow {
  public readonly context: WebGLRenderer;
  public readonly canvas: HTMLCanvasElement;

  public outputWidth: number;
  public outputHeight: number;
  public onSizeChanged: SizeChangedHandler;

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
    context.autoClear = false;

    if (opts.fullScreen) {
      window.addEventListener('resize', this.#onWindowSizeChanged);
    }

    this.context = context;
    this.canvas = context.domElement;
    this.outputWidth = width;
    this.outputHeight = height;
    this.onSizeChanged = () => {};
  }

  // @todo - Throttle
  #onWindowSizeChanged = () => {
    const { innerWidth, innerHeight, devicePixelRatio } = window;

    this.context.setSize(innerWidth, innerHeight);
    this.context.setPixelRatio(devicePixelRatio);
    this.outputWidth = innerWidth;
    this.outputHeight = innerHeight;
    info(
      `Updated render window size to {${innerWidth}, ${innerHeight}}@${devicePixelRatio}`,
    );

    this.onSizeChanged?.(innerWidth, innerHeight);
  };
}
