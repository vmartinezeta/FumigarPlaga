import Phaser from "phaser"
// src/groups/CustomGroup.js
export default class PotenciadorGroup extends Phaser.GameObjects.Group {
    constructor(scene, children, config) {
        // Llamar al constructor de la clase padre (Phaser.GameObjects.Group)
        super(scene, children, config);

        // Inicializar propiedades personalizadas
        this.scene = scene; // Guardar la escena como propiedad
        this.setup(); // Llamar a la configuración inicial
    }

    setup() {
        // Configuración inicial del grupo
        // Por ejemplo, añadir físicas, eventos, etc.
        this.scene.physics.add.existing(this, true); // Añadir físicas al grupo (opcional)
    }

    addCustomObject(x, y, texture) {
        // Método para añadir un objeto personalizado al grupo
        const obj = this.scene.add.sprite(x, y, texture); // Crear un sprite
        this.add(obj); // Añadir el sprite al grupo

        // Configurar propiedades del objeto (opcional)
        obj.setOrigin(0.5, 0.5);
        obj.setScale(1);

        return this
        // return obj; // Devolver el objeto creado
    }

    update() {
        // Método para actualizar los objetos del grupo (opcional)
        // this.getChildren().forEach(obj => {
        //     // Aquí puedes añadir lógica de actualización para cada objeto
        //     obj.angle += 1; // Ejemplo: Rotar cada objeto
        // });
    }
}