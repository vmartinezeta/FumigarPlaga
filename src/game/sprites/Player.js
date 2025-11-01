import Phaser from "phaser"
import { Punto } from "../classes/Punto";
import { VectorManager } from "../classes/VectorManager";
import { Vector } from "../classes/Vector";


export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey, vida=20) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;
        this.vida = vida;
        this.ymax = 0;
        this.rapidez = 30;
        this.tieneFuria = false;
        this.direction = new VectorManager([
            new Vector(1, new Punto(0, -1)),
            new Vector(2, new Punto(1, 0)),
            new Vector(3, new Punto(0, 1)),
            new Vector(4, new Punto(-1, 0)),
        ], 1);

        this.setScale(1);
        this.setOrigin(1 / 2);
        this.setDepth(10);
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
        this.body.setVelocity(vector.x * modulo, vector.y * modulo);
    }

    top() {
        this.play("frontal");
        const { punto } = this.direction.fromInt(1);
        this.mover(punto, punto.y * this.body.velocity.y + this.rapidez);
    }

    right() {
        this.play("der");
        const { punto } = this.direction.fromInt(2);
        this.mover(punto, punto.x * this.body.velocity.x + this.rapidez);
    }

    bottom() {
        this.play("frontal");
        const { punto } = this.direction.fromInt(3);
        this.mover(punto, punto.y * this.body.velocity.y + this.rapidez);
    }

    left() {
        this.play("izq");
        const { punto } = this.direction.fromInt(4);
        this.mover(punto, punto.x * this.body.velocity.x + this.rapidez);
    }

    setYmax(y) {
        this.ymax = y;
    }

    saltar() {
        this.play("frontal");
        const { vector } = this.direction.fromInt(1);
        this.mover(vector, 330);
    }

    update() {
        if (this.y > this.ymax)return;
        this.y = this.ymax;
        this.body.setVelocityY(0);
    }

    takeDamage() {
        if (this.tieneFuria) return;
        this.vida--;
    }

    reset() {
        this.rapidez = 30;
        this.tieneFuria = false;
    }

    debeMorir() {
        return this.vida <= 0;
    }

}