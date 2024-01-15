import { Object3D, BoxGeometry, Mesh, MeshBasicMaterial } from 'three';

import { randomFromArray } from '../utils/array';

const ColorList = [
  0xef0047, 0xf7e200, 0xb2e900, 0x3ceb18, 0x00eae8, 0x4d03f1, 0xbb12fc, 0x0c0032,
];

export const AnimationTypes = ['scale', 'rotate', 'translate'] as const;
type AnimationType = (typeof AnimationTypes)[number];

export class Shape {
  public readonly mesh: Mesh;
  public animationType: AnimationType;

  #geometry: BoxGeometry;
  #material: MeshBasicMaterial;

  constructor(parent: Object3D, animationType: AnimationType) {
    this.#geometry = new BoxGeometry(1, 1, 1);
    this.#material = this.#createMaterial();
    this.animationType = animationType;
    this.mesh = new Mesh(this.#geometry, this.#material);
    parent.add(this.mesh);
  }

  public update(timestamp: number): void {
    switch (this.animationType) {
      case 'rotate':
      default:
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
        break;

      case 'scale':
        this.mesh.scale.x += Math.sin(timestamp * 0.0025) * 0.0025;
        this.mesh.scale.y += Math.sin(timestamp * 0.0025) * 0.0025;
        this.mesh.scale.z += Math.sin(timestamp * 0.0025) * 0.0025;
        break;

      case 'translate':
        this.mesh.position.x += Math.cos(timestamp * 0.025) * 0.01;
        this.mesh.position.y += Math.cos(timestamp * 0.025) * 0.01;
        break;
    }
  }

  public destroy(): void {
    this.mesh.removeFromParent();
    this.#geometry.dispose();
    this.#material.dispose();
  }

  #createMaterial(): MeshBasicMaterial {
    try {
      const color = randomFromArray(ColorList);

      return new MeshBasicMaterial({ color });
    } catch (_) {
      return new MeshBasicMaterial({ color: 0xff00ff });
    }
  }
}
