import { Object3D } from "three";

export class PlayerMovementSystem {
  #player: Object3D;

  constructor(obj: Object3D) {
    this.#player = obj;
  }

  public update(timestamp: number): void {
    //
  }
}
