export class Punto {
    constructor(x, y) {
        this.x = x;
        if(y === undefined) {
            this.y = x;
        } else {
            this.y = y;
        }
    }

    toString() {
        return `${this.x},${this.y}`;
    }

    newInstance() {
        return new Punto(this.x, this.y);
    }
}