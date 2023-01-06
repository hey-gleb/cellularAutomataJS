import { Liquid } from './base';
import { cellSize, worldHeight } from '../const';
import type { Neighbors } from '../types/cell';
import type { Matrix } from '../types/matrix';
import { Vector2 } from '../utils/vector';

export class Water extends Liquid {
  constructor(x: number, y: number) {
    super(x, y, '#00e1ff');
  }

  init = () => {
  };

  getColor = () => this.color;

  process = (neighbors: Neighbors, matrix: Matrix) => {
    const interactNeighbors = () => {
      debugger;
      if (!bottom && this.y * cellSize !== worldHeight - cellSize) {
        this.y += 1;
        return;
      }
      if (!left) {
        this.x -= 1;
        return;
      }
      if (!right) {
        this.x += 1;
        return;
      }
    };
    const { left, bottom, right } = neighbors;
    const originalLocation = new Vector2(this.x, this.y);
    interactNeighbors();
    matrix[originalLocation.y][originalLocation.x] = undefined;
    matrix[this.y][this.x] = this;
  };
}