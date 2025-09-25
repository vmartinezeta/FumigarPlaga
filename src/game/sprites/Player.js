import Phaser from "phaser"
import { Punto } from "../classes/Punto";
import { ControlDireccional } from "../classes/ControlDireccional";
import { Direccional } from "../classes/Direccional";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey, vida) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;
        this.vida = vida || 10;
        this.ymax = 0;
        this.control = new ControlDireccional([
            new Direccional(1, 270, new Punto(0, -1)),
            new Direccional(2, 0, new Punto(1, 0)),
            new Direccional(3, 90, new Punto(0, 1)),
            new Direccional(4, 180, new Punto(-1, 0)),
        ], 1);
        
        this.setScale(1);
        this.setOrigin(1 / 2);
        this.animate(scene);
        this.play('frontal');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }

    animate(scene) {
        if (!scene.anims.exists("izq")) {
            scene.anims.create({
                key: 'izq',
                frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 3 }),
                frameRate: 12,
                repeat: -1
            })
        }

        if (!scene.anims.exists("frontal")) {
            scene.anims.create({
                key: 'frontal',
                frames: [{ key: "player", frame: 4 }],
                frameRate: 12,
                repeat: -1
            })
        }

        if (!scene.anims.exists("der")) {
            scene.anims.create({
                key: 'der',
                frames: scene.anims.generateFrameNumbers(this.imageKey, { start: 5, end: 8 }),
                frameRate: 12,
                repeat: -1
            })
        }

    }

    mover(vector, modulo) {
        this.x += modulo * vector.x
        this.y += modulo * vector.y;
    }

    top() {
        this.play("frontal");
        const direccional = this.control.fromInt(1);
        this.mover(direccional.vector, 6);
    }

    right() {
        this.play("der");
        const direccional = this.control.fromInt(2);
        this.mover(direccional.vector, 6);
    }

    bottom() {
        this.play("frontal");
        const direccional = this.control.fromInt(3);
        this.mover(direccional.vector, 6);
    }

    left() {
        this.play("izq");
        const direccional = this.control.fromInt(4);
        this.mover(direccional.vector, 6);
    }

    setYmax(y) {
        this.ymax = y;
    }

    update() {
        if (this.y > this.ymax) return;
        this.y = this.ymax;
        this.body.setVelocityY(0);
    }

}