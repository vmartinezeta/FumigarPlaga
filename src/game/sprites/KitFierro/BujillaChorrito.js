import PlayerSpray from "./PlayerSpray";


export default class BujillaChorrito extends PlayerSpray{
    constructor(scene, player){
        super(scene,player, Math.PI/6, 10);
    }

    abrir() {
        this.updateEmision();
        this.createParticle("particle");
    }    
}