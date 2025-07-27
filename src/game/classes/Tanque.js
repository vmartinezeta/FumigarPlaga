export class Tanque {
    constructor(capacidad) {
        this.capacidad = capacidad || 20;
        this.cache = structuredClone(this);
        this.capacidadMax = this.cache.capacidad;
    }

    vaciar() {
        this.capacidad --
    }

    estaVacio() {
        return this.capacidad === 0;
    }

    reset() {
        this.capacidad = this.cache.capacidad;
    }

}