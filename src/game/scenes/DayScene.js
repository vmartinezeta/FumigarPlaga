import { EventBus } from '../EventBus';
import Phaser from 'phaser';
import Player from '../sprites/Player';
import { BaseGameScene } from './BaseGameScene';
import HileraPincho from '../sprites/Enemigos/HileraPincho';
import Mosquitos from '../sprites/Enemigos/Mosquitos';
import StatusBar from '../sprites/StatusBar';


export class DayScene extends BaseGameScene {
    constructor() {
        super('DayScene');
        this.reguladorWidth = 13 / 2;
    }

    create() {
        super.create();

        this.add.tileSprite(0, 270, this.reguladorWidth * this.game.config.width, 200, "bosque")
            .setScale(.4)
            .setDepth(0)
            .setScrollFactor(0);

        this.add.tileSprite(10, 275, this.reguladorWidth * this.game.config.width, 200, "bosque")
            .setScale(.5)
            .setDepth(0)
            .setScrollFactor(0);

        this.add.tileSprite(0, 280, this.reguladorWidth * this.game.config.width, 200, "bosque")
            .setOrigin(1 / 2)
            .setScale(.6)
            .setDepth(0)
            .setScrollFactor(0);

        this.cloudTextures = ["nube", "nube-2"];

        this.clouds = this.add.tileSprite(0, 100, this.reguladorWidth * this.game.config.width, 200, this.cloudTextures[0]);
        this.clouds.setScrollFactor(.5);
        this.clouds.setAlpha(.9);
        this.clouds.setScale(.8);

        this.nextClouds = this.add.tileSprite(0, 100, this.reguladorWidth * this.game.config.width, 200, this.cloudTextures[1]);
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

        this.player = new Player(this, 100, 560, "player");
        this.player.setYmax(this.ymax);

        this.statusBar = new StatusBar(this, {
            x: 100,
            y: 30,
            vida: this.player.vida,
            capacidad: this.weaponManager.getCurrentWeapon().capacidad,
            fierro: 3,
        });

        this.uiManager.setStatusBar(this.statusBar);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.mosquitos = new Mosquitos(this, 0, this.ymax);

        this.pinchos = new HileraPincho(this);

        this.activarColisiones();        

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

    update(_, delta) {
        if (this.uiManager.gameOver) {
            const record = this.statusBar?.puntuacion || 0;
            this.scene.start('GameOver', {
                record
            });
            return;
        }

        super.update();
        this.mosquitos.update();
        this.clouds.tilePositionX += .2;


        this.gameTime += delta / 1000; // Convertir delta a segundos
        // Calcular el umbral actual: baseThreshold + (incremento por tiempo)
        // Por ejemplo, cada 10 segundos el umbral aumenta 1 pixel, hasta un máximo de 100.
        this.timeThreshold = Math.min(50, Math.floor(this.gameTime / 10));
        let currentThreshold = this.baseThreshold + this.timeThreshold;

        // Lógica de apareamiento
        this.breedFrogs(currentThreshold);
    }

}