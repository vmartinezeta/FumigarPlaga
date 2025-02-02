import Phaser from "phaser"

export default class GameStatus extends Phaser.GameObjects.Group {
    constructor(scene, children, config) {
        // Llamar al constructor de la clase padre (Phaser.GameObjects.Group)
        super(scene, children, config)
        // Inicializar propiedades personalizadas
        this.scene = scene // Guardar la escena como propiedad
        this.setup() // Llamar a la configuración inicial
        this.vida = 10
        const EJE_Y = 20

        this.rotuloVida = this.scene.add.text(40, EJE_Y, 'Vida: '+this.vida, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)

        this.rotuloCapacidad = this.scene.add.text(180, EJE_Y, 'capacidad: 10', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5).setDepth(100)

        this.add(this.rotuloVida)
        this.add(this.rotuloCapacidad)
    }

    setup() {
        // Configuración inicial del grupo
        // Por ejemplo, añadir físicas, eventos, etc.
        this.scene.physics.add.existing(this, true) // Añadir físicas al grupo (opcional)
    }

    setVida(vida) {
        if (this.vida !== vida && this.vida> 0) {
            this.vida --
            this.rotuloVida.setText("Vida: "+this.vida)
        }
    }
}