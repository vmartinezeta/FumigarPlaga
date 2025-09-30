import BorderSolido from "./BorderSolido";

export default class SueloFrontera extends BorderSolido {
    constructor(scene, x, y) {
        super(scene);
        this.AgregarSpriteHorizontal(24, x, y, "platform");
    }
}