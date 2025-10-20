import Phaser from "phaser";

export default class PowerUp extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey, type) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;
        this.type = type;
        this.setOrigin(1 / 2);
        this.timer = scene.time.delayedCall(6000, this.onEliminar, [], this);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.updateSize(300, 600);
    }

    flotar() {
        // Animación flotante
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
    }

    onEliminar() {
        this.destroy();
    }

    existe(key) {
        return this.scene.anims.exists(key);
    }

    updateSize(skyLevel, groundLevel) {
        const relativeHeight = Phaser.Math.Clamp((this.y - skyLevel) / (groundLevel - skyLevel), 0, 1);
        const minScale = 0.5;
        const maxScale = 1;
        const newScale = minScale + (maxScale - minScale) * relativeHeight;
        this.setScale(newScale);        
    }

}