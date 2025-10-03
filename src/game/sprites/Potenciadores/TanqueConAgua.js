
export default class TanqueConAgua extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;
        this.setScale(1);
        this.setOrigin(1 / 2);
        this.setDepth(5);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.animate(scene);
        scene.time.delayedCall(6000, this.onEliminar, [], this);

        scene.tweens.add({
            targets: this,
            scaleX: { from: 0.5, to: 1.2 },
            scaleY: { from: 0.5, to: 1.2 },
            duration: 500,
            repeat: -1,
            yoyo: true,
            ease: 'Back.out'
        });
        this.play("fluir");
    }

    applyEffect(spray) {
        spray.reset();
    }

    onEliminar() {
        this.destroy()
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
    }

    updateSize(skyLevel, groundLevel) {
        const relativeHeight = Phaser.Math.Clamp((this.y - skyLevel) / (groundLevel - skyLevel), 0, 1);
        const minScale = 0.5;
        const maxScale = 1;
        const newScale = minScale + (maxScale - minScale) * relativeHeight;
        this.setScale(newScale);
    }    
}