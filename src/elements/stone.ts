import { ImmovableSolid } from './base';
import type { Neighbors } from '../types/cell';
import type { Matrix } from '../types/matrix';

export class Stone extends ImmovableSolid {
  constructor(x: number, y: number) {
    super(x, y, '#521F1FA5');
  }

  init = () => {
  };

  process = (neighbors: Neighbors, matrix: Matrix) => {
    matrix[this.y][this.x] = this;
  };
}