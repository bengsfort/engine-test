import { createWindow } from './rendering/window.ts';
import './style.css';

const window = createWindow();
window.fillStyle = '#f00';
window.fillRect(0, 0, window.canvas.width, window.canvas.height);

window.fillStyle = '#00f';
window.fillRect(
  window.canvas.width / 2 / 2 - 32,
  window.canvas.height / 2 / 2 - 32,
  64,
  64,
);

document.body.appendChild(window.canvas);
