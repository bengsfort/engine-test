import { GameWindow } from './rendering/window.ts';
import './style.css';

(function main() {
  // Create window and attach it to dom
  const gameWindow = new GameWindow();
  document.body.appendChild(gameWindow.canvas);

  // Setup globals
  ENGINE_RUNNING = true;

  // Main loop
  const loop = (timestamp: number) => {
    if (ENGINE_RUNNING === false) {
      requestAnimationFrame(loop);
      return;
    }

    console.log('tick', timestamp);
    requestAnimationFrame(loop);
  };
  loop(0);
})();
