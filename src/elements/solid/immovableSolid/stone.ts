import { ImmovableSolid } from '../base';

export class Stone extends ImmovableSolid {
  constructor(x: number, y: number) {
    super(x, y, '#521F1FA5');
  }
}