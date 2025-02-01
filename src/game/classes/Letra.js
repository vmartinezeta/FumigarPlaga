export class Letra {
    constructor(origen, caracter, index) {
        this.origen = origen
        this.caracter = caracter
        this.index = index
    }

    isPrimera() {
        return this.index === 0
    }
}