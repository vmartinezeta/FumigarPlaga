import Phaser from "phaser"

export default class BarraEstado extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene);
        this.scene = scene;
        this.config = config;
        const { x, y, vida, capacidad, boquilla } = config;
        this.vida = vida;
        this.capacidad = capacidad;
        this.boquilla = boquilla;
        this.puntuacion = 0
        this.rotuloVida = this.scene.add.text(x, y, 'Vida: ' + this.vida, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100).setScrollFactor(0);

        this.rotuloCapacidad = this.scene.add.text(x + 130, y, "Capacidad: " + this.capacidad, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100).setScrollFactor(0);

        this.rotuloFierro = this.scene.add.text(x + 270, y, "Fierro: " + this.boquilla, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100).setScrollFactor(0);


        this.rotuloPuntuacion = this.scene.add.text(x + 410, y, "Puntuación: 0" , {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100).setScrollFactor(0);

        this.add(this.rotuloPuntuacion);
        this.add(this.rotuloVida);
        this.add(this.rotuloCapacidad);
        this.scene.add.existing(this);
    }

    setPuntuacion(puntuacion) {
        this.puntuacion += puntuacion;
        this.rotuloPuntuacion.setText("Puntuación: "+this.puntuacion);
    }

    setBoquilla(boquilla) {
        this.rotuloFierro.setText("Fierro: " + boquilla);
    }

    actualizar(vida, capacidad) {
        if (this.vida !== vida && this.vida >= 0) {
            this.vida = vida
            this.rotuloVida.setText("Vida: " + vida)
        }

        if (this.capacidad !== capacidad && capacidad >= 0) {
            this.capacidad = capacidad
            this.rotuloCapacidad.setText("Capacidad: " + capacidad)
        }
    }

}