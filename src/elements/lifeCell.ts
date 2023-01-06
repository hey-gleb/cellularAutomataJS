import { Element } from './base';
import type { Neighbors } from '../types/cell';
import type { Matrix } from '../types/matrix';


export class LifeCell extends Element {
  private isAlive: boolean;

  constructor(x: number, y: number) {
    super(x, y, '#000');
    this.isAlive = Math.random() * 100 < 10;
  }

  // TODO move to constructor?
  init = () => {
  };

  getColor = () => this.isAlive ? this.color : '#fff';

  process = (neighbors: Neighbors, matrix: Matrix) => {
    const aliveNeighbors = Object.values(neighbors).filter((neighbor) => neighbor ? neighbor.isAlive : false).length;
    if (!this.isAlive && aliveNeighbors === 3) {
      this.isAlive = true;
    }
    if (aliveNeighbors < 2 || aliveNeighbors > 3) this.isAlive = false;
  };
}