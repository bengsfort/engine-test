export interface IVector2 {
  x: number;
  y: number;
}

export class Vector2 implements IVector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
