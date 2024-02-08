import { Mesh, PlaneGeometry, MeshStandardMaterial } from 'three';

export class ParticleInstance {
  #active: boolean;
  #mesh: Mesh;
  #startTime: number;

  public get lifetime(): number {
    return window.PARTICLE_LIFETIME_SECS * 1000;
  }

  constructor() {
    const geo = new PlaneGeometry(1, 1);
    const mat = new MeshStandardMaterial({
      color: 0x00f700,
      emissive: 0x00f700,
      emissiveIntensity: 2,
    });
    this.#mesh = new Mesh(geo, mat);
    this.#active = false;
    this.#startTime = -1;
  }

  public setActive(value: boolean): void {
    this.#active = value;

    if (!value) {
      this.reset();
    }
  }

  public getMesh(): Mesh {
    return this.#mesh;
  }

  public update(timestamp: number): void {
    if (!this.#active) {
      return;
    }

    if (this.#startTime === -1) {
      this.#startTime = timestamp;
    }

    if (timestamp - this.#startTime >= this.lifetime) {
      this.reset();
      this.#startTime = timestamp;
    }

    // Move the mesh upwards and in a circular motion using timestamp
    const time = (timestamp - this.#startTime) / this.lifetime;
    const y = time * 10;
    const x = Math.sin(time * Math.PI * 2) * 2;
    const z = Math.cos(time * Math.PI * 2) * 2;
    this.#mesh.position.set(x * 0.01, y * 0.01, z * 0.01);
  }

  public reset(): void {
    this.#mesh.position.set(0, 0, 0);
    this.#startTime = -1;
  }
}
