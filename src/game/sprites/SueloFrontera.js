import BorderSolido from "./BorderSolido";

export default class SueloFrontera extends BorderSolido {
    constructor(scene) {
        super(scene);
        this.AgregarSpriteHorizontal(24, 0, scene.ymax, "platform");
    }
}