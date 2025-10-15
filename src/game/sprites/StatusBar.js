import Phaser from "phaser"

export default class StatusBar extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene);
        this.scene = scene;
        this.config = config;
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
        }).setOrigin(1 / 2).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloVida);

        this.rotuloCapacidad = this.scene.add.text(this.x + 130, this.y, "Capacidad: " + this.capacidad, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloCapacidad);

        this.rotuloFierro = this.scene.add.text(this.x + 270, this.y, "Fierro: " + this.fierro, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloFierro);

        this.rotuloPuntuacion = this.scene.add.text(this.x + 410, this.y, "Puntuación: 0" , {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100).setScrollFactor(0);
        this.components.push(this.rotuloPuntuacion);

        this.addMultiple(this.components);

        this.scene.add.existing(this);
    }

    setConfig(config) {
        const keys = ["vida", "capacidad", "fierro", "puntuacion"];
        
        keys.forEach((key, index)=> {
            if (key in config) {
                this.components[index].setText(keys[index]+": "+config[key]);
            }
        });
    }

}