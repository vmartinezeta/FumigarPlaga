export class ControlDireccional {
    constructor(direccionales, selectedIndex) {
        this.direccionales = direccionales || [];
        this.direccional = direccionales[selectedIndex];
    }

    fromInt(numero) {
        if (typeof numero !== "number") {
            throw new TypeError("Invalido el argumento.");
        }
        const direccional = this.direccionales.find(({id}) => id === numero);
        if (direccional) {
            this.direccional = direccional;
        }
        return this.direccional;
    }

    top() {
        return this.direccionales.find(({id}) => this.direccional.id === id && id === 1) !== undefined;
    }

    right() {
        return this.direccionales.find(({id}) => this.direccional.id === id && id === 2) !== undefined;
    }

    bottom() {
        return this.direccionales.find(({id}) => this.direccional.id === id && id === 3) !== undefined;
    }

    left() {
        return this.direccionales.find(({id})=> this.direccional.id === id && id === 4) !== undefined;
    }

    toVectorArray() {
        return this.direccionales.map(({vector}) => vector);
    }

}