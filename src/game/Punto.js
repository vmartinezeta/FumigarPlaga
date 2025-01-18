export  class Punto {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    newInstance() {
        return new Punto(this.x, this.y)
    }
}