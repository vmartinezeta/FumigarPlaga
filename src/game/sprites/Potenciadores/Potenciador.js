import Phaser from "phaser";

export default class Potenciador extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;
        this.updateSize(300, 600);
        this.setOrigin(1 / 2);

        this.animate(scene);
        this.play("running");
        this.timer = scene.time.delayedCall(6000, this.onEliminar, [], this);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    onEliminar() {
        this.destroy();
    }

    existe(key) {
        return this.scene.anims.exists(key);
    }

    animate(scene) {
        if (!this.existe("running")) {
            scene.anims.create({
                key: 'running',
                frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            });
        }

        // if (!this.existe("vida")) {
        //     scene.anims.create({
        //         key: 'vida',
        //         frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
        //         frameRate: 12,
        //         repeat: -1
        //     });
        // }
    }



    updateSize(skyLevel, groundLevel) {
        const relativeHeight = Phaser.Math.Clamp((this.y - skyLevel) / (groundLevel - skyLevel), 0, 1);
        const minScale = 0.5;
        const maxScale = 1;
        const newScale = minScale + (maxScale - minScale) * relativeHeight;
        this.setScale(newScale);        
    }    
}