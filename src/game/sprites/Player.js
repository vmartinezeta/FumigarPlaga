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
        this.rapidez = 30;
        this.tieneFuria = false;
        this.control = new ControlDireccional([
            new Direccional(1, 270, new Punto(0, -1)),
            new Direccional(2, 0, new Punto(1, 0)),
            new Direccional(3, 90, new Punto(0, 1)),
            new Direccional(4, 180, new Punto(-1, 0)),
        ], 1);

        this.canShoot = true;

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
        const { vector } = this.control.fromInt(1);
        this.mover(vector, vector.y * this.body.velocity.y + this.rapidez);
    }

    right() {
        this.play("der");
        const { vector } = this.control.fromInt(2);
        this.mover(vector, vector.x * this.body.velocity.x + this.rapidez);
    }

    bottom() {
        this.play("frontal");
        const { vector } = this.control.fromInt(3);
        this.mover(vector, vector.y * this.body.velocity.y + this.rapidez);
    }

    left() {
        this.play("izq");
        const { vector } = this.control.fromInt(4);
        this.mover(vector, vector.x * this.body.velocity.x + this.rapidez);
    }

    setYmax(y) {
        this.ymax = y;
    }

    saltar() {
        this.play("frontal");
        const { vector } = this.control.fromInt(1);
        this.mover(vector, 330);
    }

    update() {
        if (this.y > this.ymax)return;
        this.y = this.ymax;
        this.body.setVelocityY(0);

    }

    activarFuria() {
        this.tieneFuria = true;
        this.rapidez = 50;
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

    disparar(fierro, plagaGroup) {
        if (!this.canShoot || !fierro || fierro.vacio()) return;
        fierro.capacidad --;

        switch (fierro.type) {
            case 'honda':
                fierro.shoot(this.control, this.x, this.y, plagaGroup);
                break;

            case 'bomba':
                fierro.throw(this.x, this.y, this.direction);
                break;

            case 'lanzallamas':
                fierro.spray(this.control, this.x, this.y, plagaGroup);
                break;

            case 'lanzaHumo':
                fierro.launchSmoke(this.x, this.y, this.control, plagaGroup);
                break;
        }

        this.canShoot = false;
        this.scene.time.delayedCall(fierro.fireRate, () => {
            this.canShoot = true;
        });
    }
}