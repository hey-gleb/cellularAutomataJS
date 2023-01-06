import { cellSize, worldHeight, worldWidth } from '../const';

export const drawGrid = (ctx: any) => {
  ctx.beginPath();
  for (let i = 0; i < worldWidth; i += cellSize) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, worldWidth);
  }
  for (let j = 0; j < worldHeight; j += cellSize) {
    ctx.moveTo(0, j);
    ctx.lineTo(worldWidth, j);
  }
  ctx.stroke();
};