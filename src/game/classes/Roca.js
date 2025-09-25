import SuperSpray from "./SuperSpray";

export default class Roca extends SuperSpray{
    constructor(scene){
        super(scene, "particle", Math.PI/6);
    }

    lanzar() {
        this.createConcentratedSpray();
        this.estaFuera = true;
    }

    soltar() {
        this.estaFuera = false;
    }
}