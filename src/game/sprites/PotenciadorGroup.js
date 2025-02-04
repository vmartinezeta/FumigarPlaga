import Phaser from "phaser"

export default class PotenciadorGroup extends Phaser.GameObjects.Group {
    constructor(scene, children, config) {
        // Llamar al constructor de la clase padre (Phaser.GameObjects.Group)
        super(scene, children, config)

        // Inicializar propiedades personalizadas
        this.scene = scene; // Guardar la escena como propiedad
        this.setup(); // Llamar a la configuración inicial
    }

    setup() {
        // Configuración inicial del grupo
        // Por ejemplo, añadir físicas, eventos, etc.
        this.scene.physics.add.existing(this, true); // Añadir físicas al grupo (opcional)
    }

    agregar(obj) {
        this.add(obj)
    }
}