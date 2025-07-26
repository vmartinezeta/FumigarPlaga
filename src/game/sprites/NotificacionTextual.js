import Phaser from 'phaser';

export default class NotificacionTextual extends Phaser.GameObjects.Container {
    constructor(scene, config, callback) {
        super(scene);
        this.scene = scene;
        this.config = config;
        this.callback = callback;
        const {x, y, texto} = config;

        this.textual = scene.add.text(
            x, y, texto, {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        })
        this.textual.setOrigin(0.5);
        this.add(this.textual);
        this.bringToTop(this.textual);

        this.forma = scene.add.graphics();
        this.forma.fillStyle(0x000000, 1);
        this.forma.fillRect(this.textual.x - 300, this.textual.y-25, 600, 50);
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
        this.callback(this);
    }

    finalizar() {
        this.scene.time.removeEvent(this.onComplete);
        this.onEliminar(this.forma, this.textual);
    }

}