export class VectorManager {
    constructor(vectores, selectedIndex) {
        this.vectores = vectores || [];
        this.vector = vectores[selectedIndex];
    }

    fromInt(numero) {
        if (typeof numero !== "number") {
            throw new TypeError("Invalido el argumento.");
        }
        const vector = this.vectores.find(({id}) => id === numero);
        if (vector) {
            this.vector = vector;
        }
        return this.vector;
    }

    top() {
        return this.vectores.find(({id}) => this.vector.id === id && id === 1) !== undefined;
    }

    right() {
        return this.vectores.find(({id}) => this.vector.id === id && id === 2) !== undefined;
    }

    bottom() {
        return this.vectores.find(({id}) => this.vector.id === id && id === 3) !== undefined;
    }

    left() {
        return this.vectores.find(({id})=> this.vector.id === id && id === 4) !== undefined;
    }

    toVectorArray() {
        return this.vectores.map(({vector}) => vector);
    }

}