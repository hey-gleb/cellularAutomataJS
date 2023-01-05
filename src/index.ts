// const cellSize = 6;
// const windowWidth = 96;
// const windowHeight = 64;

import { Vector3 } from './utils/vector';

const cellSize = 40;
const windowWidth = 10;
const windowHeight = 10;
const deltaTime = 100;

const canvas = document.getElementById('myCanvas')!;
// @ts-ignore
const ctx = canvas.getContext('2d');

const worldWidth = cellSize * windowWidth;
const worldHeight = cellSize * windowHeight;

ctx.canvas.width = worldWidth;
ctx.canvas.height = worldHeight;

// @ts-ignore
class Elem {
  private x: number;
  private y: number;
  private movable: boolean;

  constructor(x: number, y: number, movable: boolean) {
    this.x = x;
    this.y = y;
    this.movable = movable;
  }
}

const vector = new Vector3(0, 0, 0);

class Liquid extends Elem {
  private color: string;

  constructor(x: number, y: number, color: string) {
    // @ts-ignore
    super(x, y, true);
    this.color = color;
  }
}

class Solid extends Elem {
  private color: string;

  constructor(x: number, y: number, color: string, movable: boolean) {
    // @ts-ignore
    super(x, y, movable);
    this.color = color;
  }
}

class MovableSolid extends Solid {
  constructor(x: number, y: number, color: string) {
    super(x, y, color, true);
  }
}

class ImmovableSolid extends Solid {
  constructor(x: number, y: number, color: string) {
    super(x, y, color, false);
  }
}

class Sand extends MovableSolid {
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

class Ground extends ImmovableSolid {
  constructor(x: number, y: number) {
    super(x, y, '#521F1FA5');
  }
}

const sandColors = [
  '#e7d99c',
  '#e3ba66',
  '#dca94a',
  '#b9ab7f',
];

class Water extends Liquid {
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

// @ts-ignore
let mode = undefined;
let matrix = Array.from(Array(windowWidth), () => Array.from(Array(windowWidth)));
let start = 0;

const gravity = new Vector3(0, -5, 0);

const clearCanvas = () => {
  ctx.clearRect(0, 0, worldWidth, worldHeight);
};

const drawGrid = () => {
  ctx.beginPath();
  for (let i = 0; i < worldWidth; i += cellSize) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, worldWidth);
  }
  for (let j = 0; j < worldHeight; j += cellSize) {
    ctx.moveTo(0, j);
    ctx.lineTo(worldWidth, j);
  }
  ctx.stroke();

};

const renderCell = (cell: any) => {
  ctx.fillStyle = cell.color;
  ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
};

const tick = () => {
  clearCanvas();
  let newState = Array.from(Array(windowWidth), () => Array.from(Array(windowWidth)));
  for (let y = windowHeight - 1; y >= 0; y--) {
    for (let x = windowWidth - 1; x >= 0; x--) {
      let cell = matrix[y][x];
      if (!cell) continue;
      renderCell(cell);
      let updated = false;
      // TODO fix it
      if (y + 1 >= windowHeight || x - 1 < 0) updated = true;
      const topLeft = matrix[y - 1] ? matrix[y - 1][x - 1] : undefined;
      const top = matrix[y - 1] ? matrix[y - 1][x] : undefined;
      const topRight = matrix[y - 1] ? matrix[y - 1][x + 1] : undefined;
      const left = matrix[y][x - 1];
      const right = matrix[y][x + 1];
      const bottomLeft = matrix[y + 1] ? matrix[y + 1][x - 1] : undefined;
      const bottom = matrix[y + 1] ? matrix[y + 1][x] : undefined;
      const bottomRight = matrix[y + 1] ? matrix[y + 1][x + 1] : undefined;
      const neighbors = {
        topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight,
      };
      if (cell.movable) {
        let shouldRemoveLastPosition = true;
        shouldRemoveLastPosition = cell.process(cell, neighbors, newState, shouldRemoveLastPosition);
        if (shouldRemoveLastPosition) {
          newState[y][x] = undefined;
        }
        newState[cell.y][cell.x] = cell;
        continue;
      }
      newState[y][x] = cell;
    }
  }
  // drawGrid();
  matrix = newState;
};

const loop = (ts: number) => {
  const elapsed = ts - start;
  if (elapsed > deltaTime) {
    start = ts;
    tick();
  }
  requestAnimationFrame(loop);
};

document.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) / cellSize);
  const y = Math.round((e.clientY - rect.top) / cellSize);
  // @ts-ignore
  if (!mode) {
    console.log(matrix[y][x]);
    return;
  }
  let cell;
  if (mode === 'ground') cell = new Ground(x, y);
  if (mode === 'sand') cell = new Sand(x, y);
  if (mode === 'water') cell = new Water(x, y);
  matrix[y][x] = cell;
});

document.addEventListener('keydown', e => {
  if (e.key === 'e') mode = 'sand';
  if (e.key === 'w') mode = 'ground';
  if (e.key === 'q') mode = 'water';
  if (e.key === 'r') mode = undefined;
});

const init = () => {
  matrix.forEach((row, yIndex) => {
    row.forEach((cell, xIndex) => {
      if (Math.random() < .05) {
        const groundCell = new Ground(xIndex, yIndex);
        // @ts-ignore
        groundCell.wasOpen = Math.random() > 0.4;
        matrix[yIndex][xIndex] = groundCell;
      }
    });
  });
};

ctx.beginPath();
// init();
// @ts-ignore
loop();
ctx.stroke();