import Phaser from "phaser";
import { Punto } from "../../classes/Punto";
import { ControlDireccional } from "../../classes/ControlDireccional";
import { Direccional } from "../../classes/Direccional";

export default class Rana extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey, hembra, fertil, vida = 30) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;
        this.hembra = hembra;
        this.id = Date.now() + Math.random();
        this.vida = vida;
        this.vidaMax = vida;
        this.fertil = fertil;
        this.inicio = false;
        this.finalizo = false;
        this.onComplete = null;
        this.furia = false;
        this.canReceiveDamage = true;
        this.damageCooldown = 200; // ms entre daños

        this.control = new ControlDireccional([
            new Direccional(1, 270, new Punto(0, -1)),
            new Direccional(2, 0, new Punto(1, 0)),
            new Direccional(3, 90, new Punto(0, 1)),
            new Direccional(4, 180, new Punto(-1, 0)),
        ], 3);
        this.setTint(hembra ? 0xff88ff : 0x8888ff);
        this.setOrigin(1 / 2);
        this.setScale(1);
        this.setDepth(5);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.velocidad = new Punto(-1 * Phaser.Math.Between(20, 35), Phaser.Math.Between(20, 35));

        this.body.setVelocity(this.velocidad.x, this.velocidad.y);
        this.body.setBounce(1);
        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setSize(40, 40);
        if (!this.existe("run")) {
            this.animate({
                key: 'run',
                frames: this.getFrames(imageKey, 0, 3),
                frameRate: 12,
                repeat: -1
            });
        }
        this.play('run');

        if (this.fertil) {
            this.healthBar = scene.add.graphics();
        }
        this.emitter = null;
    }

    setVelocidad(x, y) {
        this.velocidad.x = x;
        this.velocidad.y = y;
        this.body.setVelocity(x, y);
    }

    disminuirVelocidad() {
        this.body.setVelocity(this.velocidad.x * .5, this.velocidad.y * .5);
    }

    existe(key) {
        return this.scene.anims.exists(key);
    }

    getFrames(imageKey, start, end) {
        return this.scene.anims.generateFrameNumbers(imageKey, { start, end });
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

    cogiendo(macho, imageKey, completeCallback, context) {
        this.inicio = false;
        this.parar();
        macho.parar();
        this.setTexture(imageKey);
        if (!this.existe("coger")) {
            this.animate({
                key: 'coger',
                frames: this.getFrames(imageKey, 0, 2),
                frameRate: 12,
                repeat: -1
            });
        }
        this.setTint(0xff0000);
        macho.visible = false;
        this.play("coger");

        this.onComplete = this.scene.time.delayedCall(1000, completeCallback, [this, macho], context);

        this.emitter = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: 100,
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 1000,
            quantity: 2,
            emitting: true
        });
    }

    soltar() {
        if (this.emitter) {
            this.emitter.stop();
        }
        this.inicio = false;
        this.finalizo = false;
        this.setTint(this.hembra ? 0xff88ff : 0x8888ff);
        this.habilitar(true);
        this.setTexture(this.imageKey);
        this.visible = true;
        this.play("run");
    }

    debeMorir() {
        return this.vida <= 0;
    }

    morir() {
        this.scene.time.removeEvent(this.onComplete);

        if (this.healthBar) {
            this.healthBar.destroy();
        }

        this.destroy();
    }

    actual() {
        return new Punto(this.x, this.y);
    }

    takeDamage(damage) {
        if (!this.canReceiveDamage) return;

        // Activar cooldown
        this.canReceiveDamage = false;
        this.scene.time.delayedCall(this.damageCooldown, () => {
            this.canReceiveDamage = true;
        });

        this.vida = Math.max(0, this.vida - damage);
    }

    updateHealthBar(x, y, width, height) {
        this.healthBar.clear();
        // Fondo barra roja
        this.healthBar.fillStyle(0xff0000, 0.5);
        this.healthBar.fillRect(this.x - x, this.y - y, width, height);

        const factor = this.vida / this.vidaMax;
        if (!this.furia && factor < 0.5) {
            this.furia = true;
            this.setTint(0xff0000);
            this.velocidad.x *= 3;
            this.velocidad.y *= 3;
            this.body.setVelocity(this.velocidad.x, this.velocidad.y);
        }
        // Salud actual verde
        const healthWidth = factor * width;
        this.healthBar.fillStyle(0x00ff00, 0.8);
        this.healthBar.fillRect(this.x - x, this.y - y, healthWidth, height);
        this.healthBar.setDepth(5);
    }

    createImpactEffect(x, y) {
        // Emitter de salpicadura
        const splash = this.add.particles(x, y, 'splash', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.3, end: 0 },
            lifespan: 500,
            quantity: 5
        });
        splash.explode(5);

        // Tinte rojo de daño en la rana
        frog.setTint(0xff0000);
        this.time.delayedCall(100, () => frog.clearTint());
    }

    updateSize(skyLevel, groundLevel) {
        const relativeHeight = Phaser.Math.Clamp((this.y - skyLevel) / (groundLevel - skyLevel), 0, 1);
        const minScale = 0.5;
        const maxScale = 1;
        const newScale = minScale + (maxScale - minScale) * relativeHeight;
        this.setScale(newScale);
        this.updateHealthBar(20 * newScale, 40 * newScale, 40 * newScale, 5 * newScale);
    }

}