import Phaser from "phaser"
import { Punto } from "../classes/Punto"

export default class Plaga extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, hembra, puedeCoger) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.texture = texture;
        this.hembra = hembra;
        this.vida = hembra ? 30 : 50;
        this.setTint(hembra ? 0x00ffff : 0x00ff00);
        this.setOrigin(1 / 2);
        this.setScale(1);
        this.inicio = false;
        this.puedeCoger = puedeCoger;
        this.finalizo = false;
        this.onComplete = null;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.velocidad = new Punto(-1 * Phaser.Math.Between(20, 35), Phaser.Math.Between(20, 35));
        this.body.setVelocity(this.velocidad.x, this.velocidad.y);
        this.body.setBounce(1);
        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.body.setSize(30, 30);
        if (!this.existe("run")) {
            this.animate({
                key: 'run',
                frames: this.getFrames(texture, 0, 3),
                frameRate: 12,
                repeat: -1
            });
        }
        this.play('run');

        // Opcional: barra de salud visual
        if (this.puedeCoger) {
            this.healthBar = scene.add.graphics();
            this.updateHealthBar();
        }
    }

    existe(key) {
        return this.scene.anims.exists(key);
    }

    getFrames(texture, start, end) {
        return this.scene.anims.generateFrameNumbers(texture, { start, end });
    }

    rotar() {
        this.flipX = !this.flipX;
    }

    habilitar(ajuste) {
        this.body.setEnable(ajuste);
    }

    parar() {
        this.habilitar(false);
    }

    animate(config) {
        return this.scene.anims.create(config);
    }

    coger() {
        this.inicio = true;
    }

    cogiendo(macho, texture, completeCallback, context) {
        this.inicio = false;
        this.parar();
        macho.parar();
        this.setTexture(texture);
        if (!this.existe("coger")) {
            this.animate({
                key: 'coger',
                frames: this.getFrames(texture, 0, 2),
                frameRate: 12,
                repeat: -1
            });
        }
        this.setTint(0xff0000);
        macho.visible = false;
        this.play("coger");

        this.onComplete = this.scene.time.delayedCall(1000, completeCallback, [this, macho], context);
    }

    soltar() {
        this.inicio = false;
        this.finalizo = false;
        this.setTint(this.hembra ? 0x00ffff : 0x00ff00);
        this.habilitar(true);
        this.setTexture(this.texture);
        this.visible = true;
        this.play("run");
    }

    morir() {
        this.scene.time.removeEvent(this.onComplete);
        this.healthBar.destroy();
        this.destroy();    
    }

    actual() {
        return new Punto(this.x, this.y);
    }

    takeDamage(damage) {
        this.vida -= damage;
        this.updateHealthBar();

        // Efecto visual de daño
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => { this.clearTint(); });

        if (this.vida <= 0) {
            this.morir();
        }
    }

    updateHealthBar() {
        this.healthBar.clear();    
        // Fondo barra roja
        this.healthBar.fillStyle(0xff0000, 0.5);
        this.healthBar.fillRect(this.x - 20, this.y - 40, 40, 5);
        
        // Salud actual verde
        const healthWidth = (this.health / this.maxHealth) * 40;
        this.healthBar.fillStyle(0x00ff00, 0.8);
        this.healthBar.fillRect(this.x - 20, this.y - 40, healthWidth, 5);
    }


}