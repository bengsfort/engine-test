import { Scene } from 'three';

import { randomFromArray } from '../utils/array';
import { makeLoggers } from '../utils/logging';

import { AnimationTypes, Shape } from './shape';

const { info } = makeLoggers('GameScene');

export class GameScene {
  public readonly scene: Scene;

  #entityBatchCount: number;
  #targetEntityCount: number;
  #entities: Shape[] = [];

  constructor() {
    this.scene = new Scene();
    this.#entityBatchCount = 50;
    this.#targetEntityCount = 1000;
    this.#entities = [];
    this.#createMissingEntities();
  }

  public update(timestamp: number): void {
    const len = this.#entities.length;
    for (let i = 0; i < len; i++) {
      this.#entities[i].update(timestamp);
    }

    this.#createMissingEntities();
  }

  #createMissingEntities(): void {
    const missingEntities = this.#targetEntityCount - this.#entities.length;

    if (missingEntities === 0) {
      return;
    }

    const creationCount = Math.min(this.#entityBatchCount, missingEntities);
    info(`Missing ${missingEntities} entities, spawning ${creationCount}`);

    let entity: Shape;
    for (let i = 0; i < creationCount; i++) {
      entity = this.#createEntity();
      entity.mesh.position.z = Math.random() * 100;
      entity.mesh.position.x = Math.random() * 10 - 5;
      entity.mesh.position.y = Math.random() * 5 - 2.5;

      this.#entities.push(entity);
    }
  }

  #createEntity(): Shape {
    const animation = randomFromArray(AnimationTypes);
    const entity = new Shape(this.scene, animation);

    return entity;
  }
}
