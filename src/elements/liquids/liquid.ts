import { Elem } from '../base';

export abstract class Liquid extends Elem {
  private color: string;

  constructor(x: number, y: number, color: string) {
    super(x, y);
    this.color = color;
  }
}
