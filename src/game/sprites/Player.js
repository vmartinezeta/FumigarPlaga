import Phaser from "phaser"

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture, vida) {
        super(scene, origen.x, origen.y, texture);
        this.scene = scene;
        this.texture = texture;
        this.vida = vida || 10;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.setOrigin(1 / 2);
        this.setScale(1);

        this.createAnimations(scene);
        this.play('frontal');
        this.dx = 6;
        this.destino = null;
    }

    createAnimations(scene) {
        scene.anims.create({
            key: 'izq',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        })

        scene.anims.create({
            key: 'frontal',
            frames: [{ key: "player", frame: 4 }],
            frameRate: 12,
            repeat: -1
        })

        scene.anims.create({
            key: 'der',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 5, end: 8 }),
            frameRate: 12,
            repeat: -1
        })

    }

    top() {
        this.play("frontal");
        this.y -= this.dx;
        this.destino = new Phaser.Geom.Rectangle(this.x, this.y - 120, 60, 20);
    }

    right() {
        this.play("der");
        this.x += this.dx;
        this.destino = new Phaser.Geom.Rectangle(this.x + 100, this.y, 60, 20);
    }

    bottom() {
        this.play("frontal");
        this.y += this.dx;
        this.destino = new Phaser.Geom.Rectangle(this.x, this.y + 100, 60, 20);
    }

    left() {
        this.play("izq");
        this.x -= this.dx;
        this.destino = new Phaser.Geom.Rectangle(this.x - 160, this.y, 60, 20);
    }

}