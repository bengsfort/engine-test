import { PerspectiveCamera } from 'three';

import { GameWindow } from './rendering/window.ts';
import { GameScene } from './scene/game-scene.ts';
import './style.css';
import { makeLoggers } from './utils/logging.ts';
import { PerformanceMonitor } from './utils/performance.ts';

(function main() {
  // Create window and attach it to dom
  const { info } = makeLoggers('Main');

  const perf = new PerformanceMonitor();
  const gameWindow = new GameWindow();
  const game = new GameScene();
  const camera = new PerspectiveCamera(
    50,
    gameWindow.outputWidth / gameWindow.outputHeight,
  );
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
    // Update input
    game.update(timestamp);
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
