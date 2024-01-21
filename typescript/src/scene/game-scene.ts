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
  Object3D,
  BoxGeometry,
} from 'three';

import { InputManager } from '../input/input';
import { PlayerMovementSystem } from '../systems/player-movement';

// import { makeLoggers } from '../utils/logging';

// const _ = makeLoggers('GameScene');

const Vec3Zero = new Vector3(0, 0, 0);

export class GameScene {
  public readonly scene: Scene;
  public readonly floor: Mesh;
  public readonly ambientLight: DirectionalLight[];

  public readonly player: Object3D;
  #camera: Camera | null;
  #movementSystem: PlayerMovementSystem;

  constructor(input: InputManager) {
    this.scene = new Scene();
    this.floor = this.#createFloor();
    this.ambientLight = this.#createLights();
    this.player = this.#createPlayer();
    this.#movementSystem = new PlayerMovementSystem(this.player, input);
    this.#camera = null;
  }

  public update(timestamp: number): void {
    this.#movementSystem.update(timestamp);
  }

  public setCamera(camera: Camera): void {
    this.#camera = camera;
    camera.position.set(-15, 25, -15);
    camera.lookAt(Vec3Zero);
  }

  #createPlayer(): Object3D {
    const geo = new BoxGeometry(0.25, 1, 0.25);
    const mat = new MeshPhysicalMaterial({
      color: 0x4d03f1,
      side: DoubleSide,
      flatShading: true,
    });
    const player = new Mesh(geo, mat);
    player.position.y = 0.5;
    this.scene.add(player);
    return player;
  }

  #createFloor(): Mesh {
    const geo = new PlaneGeometry(25, 25);
    const mat = new MeshPhysicalMaterial({
      color: 0x0c0032,
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
      new DirectionalLight(0xffffff, 5),
      new DirectionalLight(0xffffff, 10),
      new DirectionalLight(0xffffff, 3),
    ];
    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);
    this.scene.add(...lights);
    return lights;
  }
}
