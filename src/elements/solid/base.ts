import { Elem } from '../base';

export abstract class Solid extends Elem {
  private color: string;

  constructor(x: number, y: number, color: string) {
    super(x, y);
    this.color = color;
  }
}

export abstract class ImmovableSolid extends Solid {
  constructor(x: number, y: number, color: string) {
    super(x, y, color);
  }
}

export abstract class MovableSolid extends Solid {
  constructor(x: number, y: number, color: string) {
    super(x, y, color);
  }
}