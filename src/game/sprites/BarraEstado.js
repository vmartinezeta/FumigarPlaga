import Phaser from "phaser"

export default class BarraEstado extends Phaser.GameObjects.Group {
    constructor(scene, config) {
        super(scene)
        this.scene = scene
        this.config = config
        const { x, y, vida, capacidad, boquilla } = config;
        this.vida = vida;
        this.capacidad = capacidad;
        this.boquilla = boquilla;
        this.rotuloVida = this.scene.add.text(x, y, 'Vida: ' + this.vida, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100)

        this.rotuloCapacidad = this.scene.add.text(x + 130, y, "Capacidad: "+this.capacidad, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100)

        this.rotuloBoquilla = this.scene.add.text(x + 270, y, "Boquilla: "+this.boquilla, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(1 / 2).setDepth(100);

        this.add(this.rotuloVida);
        this.add(this.rotuloCapacidad);
        this.scene.add.existing(this);
    }

    setBoquilla(boquilla) {
        this.rotuloBoquilla.setText("Boquilla: "+boquilla);
    }

    actualizar(vida, capacidad) {
        if (this.vida !== vida && this.vida >= 0) {
            this.vida = vida
            this.rotuloVida.setText("Vida: " + vida)
        }

        if (this.capacidad !== capacidad && capacidad >= 0) {
            this.capacidad = capacidad
            this.rotuloCapacidad.setText("Capacidad: "+capacidad)
        }        
    }

}