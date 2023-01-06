import type { Neighbors } from '../types/cell';
import type { Matrix } from '../types/matrix';

export abstract class Element {
  public x: number;
  public y: number;
  public color: string;

  protected constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  abstract init: () => void;

  abstract getColor: () => string;

  // TODO remove neighbors because not all the elements need it
  abstract process: (neighbors: Neighbors, matrix: Matrix) => void;
}

export abstract class Solid extends Element {
  private movable: boolean;

  protected constructor(x: number, y: number, color: string, movable: boolean) {
    super(x, y, color);
    this.movable = movable;
  }
}

export abstract class ImmovableSolid extends Solid {
  protected constructor(x: number, y: number, color: string) {
    super(x, y, color, false);
  }
}

export abstract class MovableSolid extends Solid {
  protected constructor(x: number, y: number, color: string) {
    super(x, y, color, true);
  }
}

export abstract class Liquid extends Element {
  protected constructor(x: number, y: number, color: string) {
    super(x, y, color);
  }
}
