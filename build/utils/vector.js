"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3 = void 0;
var Vector3 = /** @class */ (function () {
    function Vector3(x, y, z) {
        var _this = this;
        this.add = function (vector) {
            _this.x += vector.x;
            _this.y += vector.y;
            _this.z += vector.z;
        };
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Vector3;
}());
exports.Vector3 = Vector3;
