export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add = (vector: Vector2) => {
    this.x += vector.x;
    this.y += vector.y;
  };
}

