export class Letra {
    constructor(origen, caracter, index, lastIndex) {
        this.origen = origen
        this.caracter = caracter
        this.ultima = index === lastIndex
    }

    isUltima() {
        return this.ultima
    }
}