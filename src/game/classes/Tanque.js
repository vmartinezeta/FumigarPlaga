export class Tanque {
    constructor(capacidad=20) {
        this.capacidad = capacidad;
        this.capacidadMax = capacidad;
    }

    vaciar() {
        this.capacidad --
    }

    estaVacio() {
        return this.capacidad === 0;
    }

    reset() {
        this.capacidad = this.capacidadMax;
    }

}