import { Punto } from "./Punto"

export class ControlDireccional {
    constructor(direccionales, vector) {
        this.direccionales = direccionales || [];
        this.vector = vector || new Punto(0);
    }

    setVector(vector) {
        this.vector = vector;
    }

    fromInt(numero) {
        if (typeof numero !== "number") {
            throw new TypeError("Invalido el argumento.");
        }
        const direccional = this.direccionales.find(({id}) => id === numero);
        if (direccional) {
            this.vector = direccional.vector;
        }
        return this.vector;
    }

    top() {
        return this.direccionales.find(({vector, id}) => vector.toString() === this.vector.toString() && id === 1) !== undefined;
    }

    right() {
        return this.direccionales.find(({vector, id}) => vector.toString() === this.vector.toString() && id === 2) !== undefined;
    }

    bottom() {
        return this.direccionales.find(({vector, id}) => vector.toString() === this.vector.toString() && id === 3) !== undefined;
    }

    left() {
        return this.direccionales.find(({vector, id})=> vector.toString() === this.vector.toString() && id === 4) !== undefined;
    }

    toVectorArray() {
        return this.direccionales.map(({vector}) => vector);
    }

    newInstance() {
        return new ControlDireccional(this.direccionales, this.vector);
    }
}