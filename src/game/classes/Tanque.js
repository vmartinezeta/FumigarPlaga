export class Tanque {
    constructor() {
        this.capacidad = 10
    }

    vaciar() {
        this.capacidad --
    }

    estaVacio() {
        return this.capacidad === 0
    }

    reset() {
        this.capacidad = 10
    }
}