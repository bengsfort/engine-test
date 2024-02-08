import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D } from 'three';

import { ParticleInstance } from './particle-instance';

export class ParticleSpawner extends Object3D {
  #particlePool: ParticleInstance[];

  constructor() {
    super();
    this.#createMesh();
    this.#particlePool = this.#createParticlePool();
  }

  public update(timestamp: number) {
    const len = this.#particlePool.length;
    for (let i = 0; i < len; i++) {
      this.#particlePool[i].update(timestamp);
    }
  }

  #createMesh(): void {
    const geo = new BoxGeometry(0.25, 0.25, 0.25);
    const mat = new MeshStandardMaterial({
      color: 0xf7e200,
      emissive: 0x00f700,
      emissiveIntensity: 1,
    });
    const mesh = new Mesh(geo, mat);
    this.add(mesh);
  }

  #createParticlePool(): ParticleInstance[] {
    const pool: ParticleInstance[] = [];
    for (let i = 0; i < window.PARTICLE_COUNT; i++) {
      const instance = new ParticleInstance();
      instance.setActive(true);
      this.add(instance.getMesh());
      pool.push(instance);
    }
    return pool;
  }
}
