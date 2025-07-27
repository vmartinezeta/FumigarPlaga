import Phaser from 'phaser';

export default class NotificacionTextual extends Phaser.GameObjects.Container {
    constructor(scene, texto, x, y, width, height, callback, context) {
        super(scene);
        this.scene = scene;
        this.callback = callback;
        this.context = context;

        this.textual = scene.add.text(
            x, y, texto, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        });
        this.textual.setOrigin(1/2);
        this.add(this.textual);
        this.bringToTop(this.textual);

        this.forma = scene.add.graphics();
        this.forma.fillStyle(0x000000, 1);
        this.forma.fillRect(this.textual.x - width/2, this.textual.y- height/2, width, height);
        this.add(this.forma);
        this.sendToBack(this.forma);

        this.onComplete = scene.time.delayedCall(4000, this.onEliminar, [this.forma, this.textual], this);

        scene.tweens.add({
            targets: this.textual,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        scene.add.existing(this);
    }

    getTexto() {
        return this.textual.text;
    }

    onEliminar(forma, textual) {
        this.remove(textual, true, true);
        this.remove(forma, true, true);
        this.callback.call(this.context, this);
    }

    finalizar() {
        this.scene.time.removeEvent(this.onComplete);
        this.onEliminar(this.forma, this.textual);
    }

}