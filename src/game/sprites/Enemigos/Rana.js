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
        this.isHidden = false;
    }

    hide(x, y) {
        this.isHidden = true;
        this.previousTexture = this.texture.key;
        this.setTexture('ojitos'); // Sprite solo con ojos
        this.setAlpha(0.7); // Semi-transparente
        this.x = x;
        this.y = y;
        this.stop();
        // Reducir velocidad cuando está escondida
        if (this.body) {
            this.previousSpeed = this.body.velocity;
            this.body.setVelocity(0, 0);
        }   
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

    habilitarBody(value) {
        this.body.setEnable(value);
    }

    parar() {
        this.habilitarBody(false);
    }

    animate(config) {
        return this.scene.anims.create(config);
    }

    cogiendo(macho, imageKey, completeCallback, context) {
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

        this.scene.time.delayedCall(1000, completeCallback, [this, macho], context);
        this.scene.time.delayedCall(1000, this.soltar, [macho], this);

        this.emitter = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: 100,
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 1000,
            quantity: 2,
            emitting: true
        });
    }

    soltar(macho) {
        if (this.emitter) {
            this.emitter.stop();
        }
        this.setTint(this.hembra ? 0xff88ff : 0x8888ff);
        this.habilitarBody(true);
        macho.habilitarBody(true);
        macho.visible = true;
        if (this.isHidden) {
            this.setTexture("ojitos");
            this.stop()
        } else {
            this.setTexture(this.imageKey);
            this.play("run");
        }

        if (macho.isHidden) {
            macho.setTexture("ojitos");
            macho.stop();
        } else {
            macho.setTexture(this.imageKey);
            macho.play("run");
        }
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

    getPunto() {
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