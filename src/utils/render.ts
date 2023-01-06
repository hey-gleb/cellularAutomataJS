import { cellSize, worldHeight, worldWidth } from '../const';
import type { Element } from '../elements/base';

export const clearCanvas = (ctx: any) => {
  ctx.clearRect(0, 0, worldWidth, worldHeight);
};


export const renderCell = (ctx: any, cell: Element) => {
  if (!cell) return;
  ctx.fillStyle = cell.getColor();
  ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
};
