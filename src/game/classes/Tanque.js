export class Tanque {
    constructor(capacidad) {
        this.capacidad = capacidad || 20
        this.capacidadMax = this.capacidad
        this.cache = structuredClone(this)
    }

    vaciar() {
        this.capacidad --
    }

    estaVacio() {
        return this.capacidad === 0
    }

    reset() {
        this.capacidad = this.cache.capacidad
    }
}