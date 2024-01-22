import { PerspectiveCamera } from 'three';

import { assetRegistry } from './assets/registry';
import { InputManager } from './input/input';
import { GameWindow } from './rendering/window';
import { GameScene } from './scene/game-scene';
import './style.css';
import { makeLoggers } from './utils/logging';
import { PerformanceMonitor } from './utils/performance';

(async function main() {
  // Create window and attach it to dom
  const { info } = makeLoggers('Main');

  await assetRegistry.load();
  const fixedTimeStep = 1000 / 60;

  const perf = new PerformanceMonitor();
  const input = new InputManager();
  const gameWindow = new GameWindow();
  const game = new GameScene(input);
  const camera = new PerspectiveCamera(
    50,
    gameWindow.outputWidth / gameWindow.outputHeight,
  );

  let lastFixedUpdate = 0;

  input.registerActions();
  game.setCamera(camera);

  // Setup globals
  window.ENGINE_RUNNING = true;
  window.PERF_STATS = perf;

  // Main loop
  const loop = (timestamp: number) => {
    requestAnimationFrame(loop);

    if (ENGINE_RUNNING === false) {
      return;
    }

    // Update
    perf.frameStart();
    // Update input on other platforms
    game.update(timestamp);

    const fixedDelta = timestamp - lastFixedUpdate;
    if (fixedDelta >= fixedTimeStep) {
      lastFixedUpdate = timestamp;
      game.fixedUpdate(fixedDelta);
    }

    perf.frameEnd();

    // Render
    perf.renderStart();
    gameWindow.context.clear();
    gameWindow.context.render(game.scene, camera);
    perf.renderEnd();

    perf.captureMemory();
  };

  // Global handlers
  gameWindow.onSizeChanged = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  document.addEventListener('visibilitychange', () => {
    ENGINE_RUNNING = document.hidden === false;
    info(`${ENGINE_RUNNING ? 'UNPAUSED' : 'PAUSED'} engine`);
  });

  // Start loop
  document.body.appendChild(gameWindow.canvas);
  loop(0);
})();
