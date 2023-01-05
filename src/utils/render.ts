import { cellSize, worldHeight, worldWidth } from '../const';

export const clearCanvas = (ctx: any) => {
  ctx.clearRect(0, 0, worldWidth, worldHeight);
};


export const renderCell = (ctx: any, cell: any) => {
  ctx.fillStyle = cell.color;
  ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
};
