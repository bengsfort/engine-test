export const resizeWindow = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): void => {
  const { devicePixelRatio } = window;

  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};

export const createWindow = (): CanvasRenderingContext2D => {
  const { innerWidth, innerHeight, devicePixelRatio } = window;

  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;

  resizeWindow(canvas, innerWidth, innerHeight);
  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  return context;
};
