import Phaser from "phaser"

// src/sprites/MiSprite.js
export default class Escudo extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture, 0); // Llamar al constructor de la clase padre (Sprite)
        this.texture = texture
        // Añadir el sprite a la escena
        scene.add.existing(this);
        scene.physics.world.enable(this)
        this.body.setCollideWorldBounds(true)
        this.body.allowGravity = false
        // Configurar propiedades del sprite
        this.setOrigin(0.5, 0.5); // Centrar el punto de origen
        this.setScale(1); // Escalar el sprite
    }
}