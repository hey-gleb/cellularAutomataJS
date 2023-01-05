import { Liquid } from './liquid';
import { cellSize, worldHeight } from '../../const';

export class Water extends Liquid {
  constructor(x: number, y: number) {
    super(x, y, '#00e1ff');
  }

  process = (cell: any, neighbors: any, newState: any, shouldRemoveLastPosition: any) => {
    const { left, bottom, right } = neighbors;
    let updated = false;
    if (!bottom && !updated && cell.y * cellSize !== worldHeight - cellSize) {
      cell.y += 1;
      updated = true;
    }
    if (!left && !updated) {
      cell.x -= 1;
      updated = true;
    }
    if (!right && !updated) {
      cell.x += 1;
      updated = true;
    }

    return shouldRemoveLastPosition;
  };
}