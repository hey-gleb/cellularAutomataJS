export class Vector3 {
    private x: number;
    private y: number;
    private z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add = (vector: Vector3) => {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }
}