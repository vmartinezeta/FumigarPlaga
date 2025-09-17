import Phaser from "phaser"
import { ControlDireccional } from "../classes/ControlDireccional";
import { Punto } from "../classes/Punto";
import { Direccional } from "../../../../dude/src/game/classes/Direccional";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, vida) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.texture = texture;
        this.vida = vida || 10;
        this.setOrigin(1 / 2);
        this.setScale(1);
        this.moverse = true;
        this.control = new ControlDireccional([
            new Direccional(1, "top", new Punto(0, -1)),
            new Direccional(2, "right", new Punto(1, 0)),
            new Direccional(3, "bottom", new Punto(0, 1)),
            new Direccional(4, "left", new Punto(-1, 0)),
        ], new Punto(1, 0));
        this.destino = null;
        this.boquilla = 1;
        this.animate(scene);
        this.play('frontal');
        this.updateBoquilla();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
    }

    animate(scene) {
        if (!scene.anims.exists("izq")) {
            scene.anims.create({
                key: 'izq',
                frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
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
                frames: scene.anims.generateFrameNumbers(this.texture, { start: 5, end: 8 }),
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
        const vector = this.control.fromInt(1);
        if (this.moverse) {
            this.mover(vector, 6);
        }
        if (this.boquilla === 1) {
            this.destino = new Phaser.Geom.Line(this.x, this.y - 30, this.x, this.y - 200);
        } else if (this.boquilla === 2) {
            this.destino = new Phaser.Geom.Rectangle(this.x, this.y - 120, 60, 20);
        }
    }

    right() {
        this.play("der");
        const vector = this.control.fromInt(2);
        if (this.moverse) {
            this.mover(vector, 6);
        }
        if (this.boquilla === 1) {
            this.destino = new Phaser.Geom.Line(this.x + 30, this.y, this.x + 200, this.y);
        } else if (this.boquilla === 2) {
            this.destino = new Phaser.Geom.Rectangle(this.x + 100, this.y, 60, 20);
        }
    }

    bottom() {
        this.play("frontal");
        const vector = this.control.fromInt(3);
        if (this.moverse) {
            this.mover(vector, 6);
        }
        if (this.boquilla === 1) {
            this.destino = new Phaser.Geom.Line(this.x, this.y + 30, this.x, this.y + 200);
        } else if (this.boquilla === 2) {
            this.destino = new Phaser.Geom.Rectangle(this.x, this.y + 100, 60, 20);
        }
    }

    left() {
        this.play("izq");
        const vector = this.control.fromInt(4);
        if (this.moverse) {
            this.mover(vector, 6);
        }
        if (this.boquilla === 1) {
            this.destino = new Phaser.Geom.Line(this.x - 30, this.y, this.x - 200, this.y);
        } else if (this.boquilla === 2) {
            this.destino = new Phaser.Geom.Rectangle(this.x - 160, this.y, 60, 20);
        }
    }

    updateBoquilla() {
        if (this.control.top()) {
            this.top();
        } else if (this.control.right()) {
            this.right();
        } else if (this.control.bottom()) {
            this.bottom();
        } else if (this.control.left()) {
            this.left();
        }
    }

    setBoquilla(boquilla) {
        this.boquilla = boquilla;
        this.moverse = false;
        this.updateBoquilla();
        this.moverse = true;
    }

    permanecerAbajo(y) {
        if (this.y > y) return;
        this.y = y;
        this.body.setVelocityY(0);
    }

}