"use strict";
// const cellSize = 6;
// const windowWidth = 96;
// const windowHeight = 64;
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("./utils/vector");
var cellSize = 40;
var windowWidth = 10;
var windowHeight = 10;
var deltaTime = 100;
var canvas = document.getElementById("myCanvas");
// @ts-ignore
var ctx = canvas.getContext("2d");
var worldWidth = cellSize * windowWidth;
var worldHeight = cellSize * windowHeight;
ctx.canvas.width = worldWidth;
ctx.canvas.height = worldHeight;
// @ts-ignore
var Elem = /** @class */ (function () {
    function Elem(x, y, movable) {
        this.x = x;
        this.y = y;
        this.movable = movable;
    }
    return Elem;
}());
var vector = new vector_1.Vector3(0, 0, 0);
var Liquid = /** @class */ (function (_super) {
    __extends(Liquid, _super);
    function Liquid(x, y, color) {
        var _this = 
        // @ts-ignore
        _super.call(this, x, y, true) || this;
        _this.color = color;
        return _this;
    }
    return Liquid;
}(Elem));
var Solid = /** @class */ (function (_super) {
    __extends(Solid, _super);
    function Solid(x, y, color, movable) {
        var _this = 
        // @ts-ignore
        _super.call(this, x, y, movable) || this;
        _this.color = color;
        return _this;
    }
    return Solid;
}(Elem));
var MovableSolid = /** @class */ (function (_super) {
    __extends(MovableSolid, _super);
    function MovableSolid(x, y, color) {
        return _super.call(this, x, y, color, true) || this;
    }
    return MovableSolid;
}(Solid));
var ImmovableSolid = /** @class */ (function (_super) {
    __extends(ImmovableSolid, _super);
    function ImmovableSolid(x, y, color) {
        return _super.call(this, x, y, color, false) || this;
    }
    return ImmovableSolid;
}(Solid));
var Sand = /** @class */ (function (_super) {
    __extends(Sand, _super);
    function Sand(x, y) {
        var _this = _super.call(this, x, y, sandColors[Math.floor(Math.random() * sandColors.length)]) || this;
        // TODO remove shouldRemoveLastPosition
        _this.process = function (cell, neighbors, newState, shouldRemoveLastPosition) {
            var shouldRemove = shouldRemoveLastPosition;
            var left = neighbors.left, right = neighbors.right, bottomLeft = neighbors.bottomLeft, bottom = neighbors.bottom, bottomRight = neighbors.bottomRight;
            var originalLoc = { x: cell.x, y: cell.y };
            var updated = false;
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
        _this.vel = { x: Math.random() < 0.5 ? -1 : 1, y: 5, z: 0 };
        _this.velocity = new vector_1.Vector3(0, -62, 0);
        return _this;
    }
    return Sand;
}(MovableSolid));
var Ground = /** @class */ (function (_super) {
    __extends(Ground, _super);
    function Ground(x, y) {
        return _super.call(this, x, y, "#521F1FA5") || this;
    }
    return Ground;
}(ImmovableSolid));
var sandColors = [
    '#e7d99c',
    '#e3ba66',
    '#dca94a',
    '#b9ab7f'
];
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water(x, y) {
        var _this = _super.call(this, x, y, "#00e1ff") || this;
        _this.process = function (cell, neighbors, newState, shouldRemoveLastPosition) {
            var left = neighbors.left, bottom = neighbors.bottom, right = neighbors.right;
            var updated = false;
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
        return _this;
    }
    return Water;
}(Liquid));
// @ts-ignore
var mode = undefined;
var matrix = Array.from(Array(windowWidth), function () { return Array.from(Array(windowWidth)); });
var start = 0;
var gravity = new vector_1.Vector3(0, -5, 0);
var clearCanvas = function () {
    ctx.clearRect(0, 0, worldWidth, worldHeight);
};
var drawGrid = function () {
    ctx.beginPath();
    for (var i = 0; i < worldWidth; i += cellSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, worldWidth);
    }
    for (var j = 0; j < worldHeight; j += cellSize) {
        ctx.moveTo(0, j);
        ctx.lineTo(worldWidth, j);
    }
    ctx.stroke();
};
var renderCell = function (cell) {
    ctx.fillStyle = cell.color;
    ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
};
var tick = function () {
    clearCanvas();
    var newState = Array.from(Array(windowWidth), function () { return Array.from(Array(windowWidth)); });
    for (var y = windowHeight - 1; y >= 0; y--) {
        for (var x = windowWidth - 1; x >= 0; x--) {
            var cell = matrix[y][x];
            if (!cell)
                continue;
            renderCell(cell);
            var updated = false;
            // TODO fix it
            if (y + 1 >= windowHeight || x - 1 < 0)
                updated = true;
            var topLeft = matrix[y - 1] ? matrix[y - 1][x - 1] : undefined;
            var top_1 = matrix[y - 1] ? matrix[y - 1][x] : undefined;
            var topRight = matrix[y - 1] ? matrix[y - 1][x + 1] : undefined;
            var left = matrix[y][x - 1];
            var right = matrix[y][x + 1];
            var bottomLeft = matrix[y + 1] ? matrix[y + 1][x - 1] : undefined;
            var bottom = matrix[y + 1] ? matrix[y + 1][x] : undefined;
            var bottomRight = matrix[y + 1] ? matrix[y + 1][x + 1] : undefined;
            var neighbors = {
                topLeft: topLeft,
                top: top_1,
                topRight: topRight,
                left: left,
                right: right,
                bottomLeft: bottomLeft,
                bottom: bottom,
                bottomRight: bottomRight
            };
            if (cell.movable) {
                var shouldRemoveLastPosition = true;
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
var loop = function (ts) {
    var elapsed = ts - start;
    if (elapsed > deltaTime) {
        start = ts;
        tick();
    }
    requestAnimationFrame(loop);
};
document.addEventListener("click", function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = Math.round((e.clientX - rect.left) / cellSize);
    var y = Math.round((e.clientY - rect.top) / cellSize);
    // @ts-ignore
    if (!mode) {
        console.log(matrix[y][x]);
        return;
    }
    var cell;
    if (mode === 'ground')
        cell = new Ground(x, y);
    if (mode === 'sand')
        cell = new Sand(x, y);
    if (mode === 'water')
        cell = new Water(x, y);
    matrix[y][x] = cell;
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'e')
        mode = 'sand';
    if (e.key === 'w')
        mode = 'ground';
    if (e.key === 'q')
        mode = 'water';
    if (e.key === 'r')
        mode = undefined;
});
var init = function () {
    matrix.forEach(function (row, yIndex) {
        row.forEach(function (cell, xIndex) {
            if (Math.random() < .05) {
                var groundCell = new Ground(xIndex, yIndex);
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
