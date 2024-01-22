import { Object3D, Vector2, Vector3 } from 'three';

import { InputManager } from '../input/input';

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
  #boundaries: Vector2 = new Vector2();
  #range: [Vector3, Vector3] = [
    new Vector3(-9999, -9999, -9999),
    new Vector3(9999, 9999, 9999),
  ];

  // @todo: Make time class...
  #prevFrameTime = 0;
  #state: PhysicsState = {
    inputVelocity: new Vector2(),
    velocity: new Vector3(),
    actualPosition: new Vector3(),
  };

  public set boundaries(value: Vector2) {
    this.#boundaries = value;
    const [min, max] = this.#range;

    const halfX = value.x / 2;
    const halfY = value.y / 2;

    min.set(-halfX, this.#player.position.y, -halfY);
    max.set(halfX, this.#player.position.y, halfY);
  }

  public get boundaries(): Vector2 {
    return this.#boundaries;
  }

  constructor(obj: Object3D, input: InputManager) {
    this.#player = obj;
    this.#input = input;
    this.#state.actualPosition.copy(obj.position);
  }

  public update(timestamp: number): void {
    const delta = timestamp - this.#prevFrameTime;
    this.#prevFrameTime = timestamp;

    this.#parseInput();

    // Optimistic update
    const velocity = this.#state.velocity.clone();
    this.#player.position.add(velocity.divideScalar(delta));
    this.#restrictMovement();
  }

  public fixedUpdate(fixedDelta: number): void {
    this.#physicsUpdate(fixedDelta);
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
    this.#restrictMovement();
    this.#state.actualPosition.copy(this.#player.position);
  }

  #restrictMovement(): void {
    const { position } = this.#player;
    const [min, max] = this.#range;
    position.clamp(min, max);
  }
}
