import PlayerAndSpray from "./PlayerAndSpray";


export default class Roca extends PlayerAndSpray{
    constructor(scene, player, particles){
        super(scene,player, particles, Math.PI/6);
    }

    lanzar() {
        this.updateEmision();
        this.createConcentratedSpray();
        this.estaFuera = true;
    }

    soltar() {
        this.estaFuera = false;
    }
}