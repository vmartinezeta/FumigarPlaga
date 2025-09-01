import Phaser from "phaser"
import { Punto } from "../classes/Punto"

export default class Plaga extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture, hembra) {
        super(scene, origen.x, origen.y, texture);
        this.scene = scene;
        this.texture = texture;
        this.hembra = hembra;
        this.vida = 30;
        this.tint = hembra ? 0x00ffff : 0x00ff00;
        this.setOrigin(1 / 2);
        this.setScale(1);
        this.inicio = false;
        this.finalizo = false;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.velocidad = new Punto(Phaser.Math.Between(20, 35), Phaser.Math.Between(20, 35));
        this.body.setVelocity(this.velocidad.x, this.velocidad.y);
        this.rotar();
        this.body.setBounce(1);
        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.body.setSize(30,30);
        this.createAnimations(scene);
        this.play('run');
    }

    rotar() {
        this.flipX = !this.flipX;
    }

    disabledBody() {
        this.body.setEnable(false)
    }

    createAnimations(scene) {
        if (scene.anims.exists("run")) return
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
    }

    coger() {
        this.inicio = true
    }

    cogiendo(macho, completeCallback, context) {
        this.inicio = false;
        this.detener();
        macho.detener();

        if (this.body.velocity.x < 0 && macho.body.velocity.x>0
            || this.body.velocity.x > 0 && macho.body.velocity.x < 0
        ) {
            macho.body.velocity.x *=-1;
            macho.rotar();
        }
        if (this.body.velocity.x < 0 && macho.body.velocity.x>0) {
            macho.x = this.x + 2;
        } else if (this.body.velocity.x > 0 && macho.body.velocity.x < 0) {
            macho.x = this.x - 2;
        }
        macho.y = this.y;
        this.setTint(0xff0505);
        macho.setTint(0x0e02b7);

        this.scene.add.tween({
            targets: this,
            scaleX: { from: .6, to: 1 },
            scaleY: { from: .6, to: 1 },
            duration: 1000,
            ease: 'Back.out',
            onComplete: () => {
                completeCallback.call(context, this, macho);
            }
        });
    }

    detener() {
        this.body.setEnable(false);
    }

    soltar() {
        this.inicio = false;
        this.finalizo = false;
        if (this.body) {
            this.body.setEnable(true)
        }
        this.tint = this.hembra ? 0x00ffff : 0x00ff00;
    }

    morir() {
        this.destroy();
    }

    actual() {
        return new Punto(this.x, this.y);
    }
}