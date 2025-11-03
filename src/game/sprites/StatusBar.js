import Phaser from "phaser"

export default class StatusBar extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene);
        this.scene = scene;
        this.x = config.x;
        this.y = config.y;
        this.vida = config.vida;
        this.capacidad = config.capacidad;
        this.fierro = config.fierro;
        this.puntuacion =  0;
        this.components = []
        this.rotuloVida = this.scene.add.text(this.x, this.y, 'Vida: ' + this.vida, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloVida);

        this.rotuloPowerUp = this.scene.add.text(this.x, this.y+20, 'PowerUp: N/D' , {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloPowerUp);

        this.rotuloFierro = this.scene.add.text(this.x + 160, this.y, "Fierro: " + this.fierro, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloFierro);

        this.rotuloCapacidad = this.scene.add.text(this.x + 160, this.y+20, "Capacidad: " + this.capacidad, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloCapacidad);

        this.rotuloPuntuacion = this.scene.add.text(this.x +160, this.y+40, "Puntuación: 0" , {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloPuntuacion);


        this.addMultiple(this.components);

        this.scene.add.existing(this);
    }

    setConfig(config) {
        if ("vida" in config) {
            this.rotuloVida.setText("Vida: "+config.vida);
        }
        if ("powerUp" in config) {
            this.rotuloPowerUp.setText("PowerUp: "+config.powerUp);
        }
        if ("puntuacion" in config) {
            this.puntuacion += config.puntuacion;
            this.rotuloPuntuacion.setText("Puntuacion: "+this.puntuacion);
        }
        if ("fierro" in config) {
            this.rotuloFierro.setText("Fierro: "+config.fierro);
        }
        if ("capacidad" in config) {
            this.rotuloCapacidad.setText("Capacidad: "+config.capacidad);
        }
    }

}