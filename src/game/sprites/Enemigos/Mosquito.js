import Phaser from "phaser"

export default class Mosquito extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;        
        // this.setScale(1/6);
        this.setOrigin(1 / 2);
        this.setDepth(10);
        this.animate(scene);
        this.play('volar');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setVelocity(40, 40);
    }

    bajar() {
        const vy = this.body.velocity.y;
        this.body.setVelocity(-1*vy);
    }

    animate(scene) {
        if (!scene.anims.exists("volar")) {
            scene.anims.create({
                key: 'volar',
                frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            })
        }
    }


   updateSize(skyLevel, groundLevel) {
         const relativeHeight = Phaser.Math.Clamp((this.y - skyLevel) / (groundLevel - skyLevel), 0, 1);
         const minScale = 0.1;
         const maxScale = .25;
         const newScale = minScale + (maxScale - minScale) * relativeHeight;
         this.setScale(newScale);
     }
}