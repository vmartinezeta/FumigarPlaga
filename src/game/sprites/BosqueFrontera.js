import BorderSolido from "./BorderSolido";

export default class BosqueFrontera extends BorderSolido {
    constructor(scene) {
        super(scene);        
        this.AgregarSpriteHorizontal(24, 0, scene.ymax-100, "platform");
    }
    
    
}