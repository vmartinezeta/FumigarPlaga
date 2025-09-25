import SuperSpray from "./SuperSpray";


export default class BujillaChorrito extends SuperSpray{
    constructor(scene){
        super(scene, "particle", Math.PI/6, 10);
    }

    abrir() {
        this.createConcentratedSpray();
        this.estaFuera = true;
    }    
}