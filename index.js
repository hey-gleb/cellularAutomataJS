const cellSize = 6;
const windowWidth = 96;
const windowHeight = 64;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const worldWidth = cellSize * windowWidth;
const worldHeight = cellSize * windowHeight;

ctx.canvas.width = worldWidth;
ctx.canvas.height = worldHeight;

class Element {
  constructor(x, y, movable) {
    this.x = x;
    this.y = y;
    this.movable = movable;
  }
}

class Liquid extends Element {
  constructor(x, y, color) {
    super(x, y, true);
    this.color = color;
  }
}

class Solid extends Element {
  constructor(x, y, color, movable) {
    super(x, y, movable);
    this.color = color;
  }
}

class MovableSolid extends Solid {
  constructor(x, y, color) {
    super(x, y, color, true);
  }
}

class ImmovableSolid extends Solid {
  constructor(x, y, color) {
    super(x, y, color, false);
  }
}

class Sand extends MovableSolid {
  constructor(x, y) {
    super(x, y, "#ffff00");
  }

  // TODO remove shouldRemoveLastPosition
  process = (cell, neighbors, newState, shouldRemoveLastPosition) => {
    let shouldRemove = shouldRemoveLastPosition;
    const {left, right, bottomLeft, bottom, bottomRight} = neighbors;
    const originalLoc = {x: cell.x, y: cell.y};
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
  }
}

class Ground extends ImmovableSolid {
  constructor(x, y) {
    super(x, y, "#521F1FA5");
  }
}

class Water extends Liquid {
  constructor(x, y) {
    super(x, y, "#00e1ff");
  }

  process = (cell, neighbors, newState, shouldRemoveLastPosition) => {
    const {left, bottom, right} = neighbors;
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
  }
}

let mode = undefined;
let matrix = Array.from(Array(windowWidth), () => Array.from(Array(windowWidth)));
let start = 0;

const clearCanvas = () => {
  ctx.clearRect(0, 0, worldWidth, worldHeight);
}

const drawGrid = () => {
  ctx.beginPath()
  for (let i = 0; i < worldWidth; i += cellSize) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, worldWidth);
  }
  for (let j = 0; j < worldHeight; j += cellSize) {
    ctx.moveTo(0, j);
    ctx.lineTo(worldWidth, j);
  }
  ctx.stroke();

}

const renderCell = (cell) => {
  ctx.fillStyle = cell.color;
  ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
}

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
        topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight
      }
      if (cell.movable) {
        let shouldRemoveLastPosition = true;
        shouldRemoveLastPosition = cell.process(cell, neighbors, newState, shouldRemoveLastPosition)
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
}

const loop = (ts) => {
  const elapsed = ts - start;
  if (elapsed > 30) {
    start = ts;
    init()
    tick();
  }
  requestAnimationFrame(loop);
}

document.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) / cellSize);
  const y = Math.round((e.clientY - rect.top) / cellSize);
  if (!mode) {
    console.log(matrix[y][x]);
    return;
  }
  let cell;
  if (mode === 'ground') cell = new Ground(x, y);
  if (mode === 'sand') cell = new Sand(x, y);
  if (mode === 'water') cell = new Water(x, y);
  matrix[y][x] = cell
})

document.addEventListener('keydown', e => {
  if (e.key === 'e') mode = 'sand';
  if (e.key === 'w') mode = 'ground';
  if (e.key === 'q') mode = 'water';
  if (e.key === 'r') mode = undefined;
});

const init = () => {
  // matrix.forEach((row, yIndex) => {
  //   row.forEach((cell, xIndex) => {
  //     if (Math.random() < .05) {
  //       matrix[yIndex][xIndex] = new Ground(xIndex, yIndex)
  //     }
  //   })
  // })
  // matrix[0].forEach((cell, xIndex) => {
  //   if (Math.random() < .0009) {
  //     matrix[0][xIndex] = new Water(xIndex, 0);
  //   }
  // })
}

ctx.beginPath()
// init();
loop();
ctx.stroke();
