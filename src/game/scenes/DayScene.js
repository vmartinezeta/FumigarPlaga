import { EventBus } from '../EventBus';
import Phaser from 'phaser';
import Player from '../sprites/Player';
import BarraEstado from '../sprites/BarraEstado';
import { BaseGameScene } from './BaseGameScene';


export class DayScene extends BaseGameScene {
    constructor() {
        super('DayScene');
        this.plagaGroup = null;
        this.borders = null;
        this.player = null;
        this.emitter = null;       
        this.tanque = null;
        this.potenciadorGroup = null;
        this.dock = null;
        this.gameWidth = 4000;
        this.gameHeight = 600;
    }

    create() {
        super.create();
        this.bosque = this.add.tileSprite(0, 256, this.width, 200, "bosque");
        this.bosque.setOrigin(1 / 2);
        this.bosque.setScale(.6)
        this.bosque.setScrollFactor(0);

        this.cloudTextures = ["nube", "nube-2"];

        this.clouds = this.add.tileSprite(0, 100, 6000, 200, this.cloudTextures[0]);
        this.clouds.setScrollFactor(.5);
        this.clouds.setAlpha(.9);
        this.clouds.setScale(.8);

        this.nextClouds = this.add.tileSprite(0, 100, 6000, 200, this.cloudTextures[1]);
        this.nextClouds.setScrollFactor(.5);
        this.nextClouds.setAlpha(0);
        this.nextClouds.setScale(.8);

        this.forestAmbience = this.sound.add('bosque-tenebroso', {
            volume: 0.4,
            loop: true
        });
        this.forestAmbience.play();
        this.createCreepySounds();

        // Timer para cambiar texturas
        this.textureTimer = this.time.addEvent({
            delay: 10000,
            callback: this.smoothTextureTransition,
            callbackScope: this,
            loop: true
        });

        this.textureIndex = 0;

        this.barraEstado = new BarraEstado(this, {
            x: 100,
            y: 30,
            vida: 10,
            capacidad: 10,
            boquilla: 1
        });

        this.player = new Player(this, 100, 560, "player");
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.detectarColision();
        
        EventBus.emit('current-scene-ready', this);
    }

    createCreepySounds() {
        // Viento aullante cada 20-30 segundos
        this.time.addEvent({
            delay: Phaser.Math.Between(20000, 30000),
            callback: () => {
                this.sound.play('efecto-1', { volume: 0.3 });
            },
            loop: true
        });

        // Lechuza cada 15-25 segundos  
        this.time.addEvent({
            delay: Phaser.Math.Between(15000, 25000),
            callback: () => {
                this.sound.play('efecto-2', { volume: 0.2 });
            },
            loop: true
        });

        // Rama quebrada aleatoria
        this.time.addEvent({
            delay: Phaser.Math.Between(10000, 40000),
            callback: () => {
                this.sound.play('efecto-3', { volume: 0.25 });
            },
            loop: true
        });

        // Croar de ranas tenebroso
        this.time.addEvent({
            delay: Phaser.Math.Between(5000, 15000),
            callback: () => {
                this.sound.play('efecto-3', {
                    volume: 0.15,
                    detune: Phaser.Math.Between(-200, -400) // Más grave
                });
            },
            loop: true
        });
    }

    smoothTextureTransition() {
        // 1. Preparar siguiente textura
        this.textureIndex = (this.textureIndex + 1) % this.cloudTextures.length;
        this.nextClouds.setTexture(this.cloudTextures[this.textureIndex]);

        // 2. Animación de crossfade (3 segundos)
        this.tweens.add({
            targets: this.clouds,
            alpha: 0,
            duration: 3000,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: this.nextClouds,
            alpha: 1,
            duration: 3000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                // 3. Intercambiar roles
                const temp = this.clouds;
                this.clouds = this.nextClouds;
                this.nextClouds = temp;
                this.nextClouds.setAlpha(0);
            }
        });
    }

    update() {
        if (this.gameOver) return;
        super.update();
        this.clouds.tilePositionX += .2;
    }
}