import PlayerAndSpray from "./PlayerAndSpray";


export default class BujillaChorrito extends PlayerAndSpray{
    constructor(scene, player, particles){
        super(scene,player, particles, Math.PI/6, 10);
    }

    abrir() {
        this.updateEmision();
        this.createConcentratedSpray();
        this.estaFuera = true;
    }    
}