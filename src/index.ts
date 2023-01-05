import { worldHeight, worldWidth, windowWidth, windowHeight, cellSize, deltaTime } from './const';
import { Sand } from './elements/solid/movableSolid/sand';
import { Water } from './elements/liquids/water';
import { Stone } from './elements/solid/immovableSolid/stone';
import { clearCanvas, renderCell } from './utils/render';

let matrix = Array.from(Array(windowWidth), () => Array.from(Array(windowWidth)));
const canvas = document.getElementById('myCanvas')!;
// @ts-ignore
const ctx = canvas.getContext('2d');

ctx.canvas.width = worldWidth;
ctx.canvas.height = worldHeight;

const step = () => {
  clearCanvas(ctx);
  let newState = Array.from(Array(windowWidth), () => Array.from(Array(windowWidth)));
  for (let y = windowHeight - 1; y >= 0; y--) {
    for (let x = windowWidth - 1; x >= 0; x--) {
      let cell = matrix[y][x];
      if (!cell) continue;
      renderCell(ctx, cell);
      let updated = false;
      // TODO fix it
      if (y + 1 >= windowHeight || x - 1 < 0) updated = true;
      const topLeft = matrix[y - 1] ? matrix[y - 1][x - 1] : undefined;
      const top = matrix[y - 1] ? matrix[y - 1][x] : undefined;
      const topRight = matrix[y - 1] ? matrix[y - 1][x + 1] : undefined;
      const left = matrix[y][x - 1];
      const right = matrix[y][x + 1];
      const bottomLeft = matrix[y + 1] ? matrix[y + 1][x - 1] : undefined;
      const bottom = matrix[y + 1] ? matrix[y + 1][x] : undefined;
      const bottomRight = matrix[y + 1] ? matrix[y + 1][x + 1] : undefined;
      const neighbors = {
        topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight,
      };
      if (cell.movable) {
        let shouldRemoveLastPosition = true;
        shouldRemoveLastPosition = cell.process(cell, neighbors, newState, shouldRemoveLastPosition);
        if (shouldRemoveLastPosition) {
          newState[y][x] = undefined;
        }
        newState[cell.y][cell.x] = cell;
        continue;
      }
      newState[y][x] = cell;
    }
  }
  matrix = newState;
};

const main = () => {
  const loop = (ts: number) => {
    const elapsed = ts - start;
    if (elapsed > deltaTime) {
      start = ts;
      step();
    }
    requestAnimationFrame(loop);
  };

  // @ts-ignore
  let mode = undefined;
  let start = 0;

  document.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / cellSize);
    const y = Math.round((e.clientY - rect.top) / cellSize);
    // @ts-ignore
    if (!mode) {
      console.log(matrix[y][x]);
      return;
    }
    let cell;
    if (mode === 'ground') cell = new Stone(x, y);
    if (mode === 'sand') cell = new Sand(x, y);
    if (mode === 'water') cell = new Water(x, y);
    matrix[y][x] = cell;
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'e') mode = 'sand';
    if (e.key === 'w') mode = 'ground';
    if (e.key === 'q') mode = 'water';
    if (e.key === 'r') mode = undefined;
  });

  ctx.beginPath();
  loop(0);
  ctx.stroke();
};

main();