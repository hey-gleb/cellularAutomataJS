import { MovableSolid } from './base';
import { cellSize, worldHeight } from '../const';
import type { Neighbors } from '../types/cell';
import type { Matrix } from '../types/matrix';
import { Vector2 } from '../utils/vector';


const sandColors = [
  '#e7d99c',
  '#e3ba66',
  '#dca94a',
  '#b9ab7f',
];

export class Sand extends MovableSolid {
  constructor(x: number, y: number) {
    super(x, y, sandColors[Math.floor(Math.random() * sandColors.length)]);
  }

  init = () => {
  };

  process = (neighbors: Neighbors, matrix: Matrix) => {
    const interactNeighbors = () => {
      if (!bottom && this.y * cellSize !== worldHeight - cellSize) {
        this.y += 1;
        return;
      }
      if (bottom) {
        // if (bottom.type === 'water') {
        //   bottom.y -= 1;
        //   newState[originalLoc.y][originalLoc.x] = bottom;
        //   cell.y += 1;
        //   updated = true;
        //   shouldRemove = false;
        // }
        if (!left && !bottomLeft) {
          this.x -= 1;
          this.y += 1;
          return;
        }
        if (!right && !bottomRight) {
          this.x += 1;
          this.y += 1;
          return;
        }
      }
    };

    const { left, right, bottomLeft, bottom, bottomRight } = neighbors;
    const originalLocation = new Vector2(this.x, this.y);
    interactNeighbors();
    matrix[originalLocation.y][originalLocation.x] = undefined;
    matrix[this.y][this.x] = this;
  };
}