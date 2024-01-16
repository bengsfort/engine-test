import {
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Scene,
  Vector3,
  MathUtils,
  Camera,
} from 'three';

// import { makeLoggers } from '../utils/logging';

// const _ = makeLoggers('GameScene');

const Vec3Zero = new Vector3(0, 0, 0);

export class GameScene {
  public readonly scene: Scene;
  public readonly floor: Mesh;
  public readonly ambientLight: DirectionalLight[];

  #camera: Camera | null;

  constructor() {
    this.scene = new Scene();
    this.floor = this.#createFloor();
    this.ambientLight = this.#createLights();
    this.#camera = null;
  }

  public update(_timestamp: number): void {
    //
  }

  public setCamera(camera: Camera): void {
    this.#camera = camera;
    camera.position.set(15, 15, -15);
    camera.lookAt(Vec3Zero);
  }

  #createFloor(): Mesh {
    const geo = new PlaneGeometry(20, 20);
    const mat = new MeshPhysicalMaterial({
      color: 0x0c0032,
      emissive: 0x4d03f1,
      side: DoubleSide,
      flatShading: true,
    });
    const floor = new Mesh(geo, mat);
    floor.rotateX(MathUtils.DEG2RAD * 90);
    this.scene.add(floor);
    return floor;
  }

  #createLights(): DirectionalLight[] {
    const lights = [
      new DirectionalLight(0xffffff, 3),
      new DirectionalLight(0xffffff, 3),
      new DirectionalLight(0xffffff, 3),
    ];
    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);
    this.scene.add(...lights);
    return lights;
  }
}
