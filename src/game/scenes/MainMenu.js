import { EventBus } from '../EventBus'
import { Scene } from 'phaser'
import BasicAnimation from '../sprites/BasicAnimation';

export class MainMenu extends Scene {

    constructor() {
        super('MainMenu');
        this.animacion = null;
        this.letra = null;
        this.reactCallback = null;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00f94f);
        this.animacion = new BasicAnimation(this, 350, 200, "FUMIGAR", 50);
        EventBus.emit('current-scene-ready', this);
    }

    siguiente(letra) {
        this.reactCallback(letra);
    }

    changeScene(key) {
        this.scene.start(key);
        return this.scene.manager.getScene(key)
    } 

    moverLetra(reactCallback) {
        this.reactCallback = reactCallback;
        this.animacion.iniciar(this.siguiente, this);
    }

    cancelAnimation() {
        this.animacion.cancelar();
        this.animacion.destroy();
    }

    reiniciar() {
        this.animacion.reiniciar(this.siguiente, this);
    }
}