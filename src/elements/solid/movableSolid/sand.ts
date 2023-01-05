import { Vector3 } from '../../../utils/vector';
import { MovableSolid } from '../base';
import { cellSize, worldHeight } from '../../../const';


const sandColors = [
  '#e7d99c',
  '#e3ba66',
  '#dca94a',
  '#b9ab7f',
];

export class Sand extends MovableSolid {
  private vel: { x: number; y: number; z: number };
  private velocity: Vector3;

  constructor(x: number, y: number) {
    super(x, y, sandColors[Math.floor(Math.random() * sandColors.length)]);
    this.vel = { x: Math.random() < 0.5 ? -1 : 1, y: 5, z: 0 };
    this.velocity = new Vector3(0, -62, 0);
  }

  // TODO remove shouldRemoveLastPosition
  process = (cell: any, neighbors: any, newState: any, shouldRemoveLastPosition: any) => {
    let shouldRemove = shouldRemoveLastPosition;
    const { left, right, bottomLeft, bottom, bottomRight } = neighbors;
    const originalLoc = { x: cell.x, y: cell.y };
    let updated = false;

    if (!bottom && !updated && cell.y * cellSize !== worldHeight - cellSize) {
      cell.y += 1;
      updated = true;
    }
    if (bottom && !updated) {
      if (bottom.type === 'water') {
        bottom.y -= 1;
        newState[originalLoc.y][originalLoc.x] = bottom;
        cell.y += 1;
        updated = true;
        shouldRemove = false;
      }
      if (!left && !bottomLeft && !updated) {
        cell.x -= 1;
        cell.y += 1;
        updated = true;
      }
      if (!right && !bottomRight && !updated) {
        cell.x += 1;
        cell.y += 1;
        updated = true;
      }
    }
    return shouldRemove;
  };
}