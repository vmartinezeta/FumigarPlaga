import Phaser from "phaser";

export default class Potenciador extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        console.log('Creando potenciador de tipo:', this.constructor.name)
        this.scene = scene;
        this.setScale(1);
        this.setOrigin(1 / 2);

        this.animate(scene);
        scene.time.delayedCall(6000, this.onEliminar, [], this);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    applyEffect(objetivo) {
        
    }

    onEliminar() {
        this.destroy();
    }

    existe(key) {
        return this.scene.anims.exists(key);
    }

    animate(scene) {
        if (!this.existe("fluir")) {
            scene.anims.create({
                key: 'fluir',
                frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            });
        }

        if (!this.existe("vida")) {
            scene.anims.create({
                key: 'vida',
                frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }
}