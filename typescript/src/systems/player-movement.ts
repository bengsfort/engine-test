import { Object3D, Vector2, Vector3 } from 'three';

import { InputManager } from '../input/input';

const FIXED_TIME_STEP = 1000 / 60;

interface PhysicsState {
  inputVelocity: Vector2;
  velocity: Vector3;
  actualPosition: Vector3;
}

export class PlayerMovementSystem {
  public accel = 0.05 * 0.1;
  public speed = 2.5 * 0.1;
  public decel = 0.75 * 0.1;

  #player: Object3D;
  #input: InputManager;

  // @todo: Make time class...
  #prevFrameTime = 0;
  #prevFixedTime = 0;
  #state: PhysicsState = {
    inputVelocity: new Vector2(),
    velocity: new Vector3(),
    actualPosition: new Vector3(),
  };

  constructor(obj: Object3D, input: InputManager) {
    this.#player = obj;
    this.#input = input;
    this.#state.actualPosition.copy(obj.position);
  }

  public update(timestamp: number): void {
    const delta = timestamp - this.#prevFrameTime;
    const fixedDelta = timestamp - this.#prevFixedTime;

    this.#prevFrameTime = timestamp;

    this.#parseInput();

    if (fixedDelta >= FIXED_TIME_STEP) {
      this.#prevFixedTime = timestamp;
      this.#physicsUpdate(fixedDelta);
      return;
    }

    // Optimistic update
    this.#player.position.add(this.#state.velocity.clone().divideScalar(delta));
  }

  #parseInput() {
    this.#state.inputVelocity.set(0, 0);

    if (this.#input.getActionActive('left')) {
      this.#state.inputVelocity.x += 1;
    }

    if (this.#input.getActionActive('right')) {
      this.#state.inputVelocity.x -= 1;
    }

    if (this.#input.getActionActive('up')) {
      this.#state.inputVelocity.y += 1;
    }

    if (this.#input.getActionActive('down')) {
      this.#state.inputVelocity.y -= 1;
    }
  }

  #physicsUpdate(delta: number) {
    const velocity = this.#state.velocity;

    // Normalize and assign acceleration
    const input = this.#state.inputVelocity.clone().normalize();
    input.x *= this.accel;
    input.y *= this.accel;

    // Add input to velocity and clamp to min/max
    velocity.x += input.x * delta;
    velocity.z += input.y * delta;
    velocity.clampLength(-this.speed, this.speed);

    // If no input on an axis, apply decel on that axis
    if (input.x === 0 && velocity.x !== 0) {
      let diff = 0 - velocity.x;
      if (Math.abs(diff) > this.decel) {
        diff = Math.sign(diff) * this.decel;
      }
      velocity.x += diff;
    }

    if (input.y === 0 && velocity.z !== 0) {
      let diff = 0 - velocity.z;
      if (Math.abs(diff) > this.decel) {
        diff = Math.sign(diff) * this.decel;
      }
      velocity.z += diff;
    }

    // Apply changes against cached position, then update cache
    this.#player.position.copy(this.#state.actualPosition).add(velocity);
    this.#state.actualPosition.copy(this.#player.position);
  }
}
