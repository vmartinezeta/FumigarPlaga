import Phaser from "phaser"

// src/sprites/MiSprite.js
export default class Potenciador extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture, 0); // Llamar al constructor de la clase padre (Sprite)
        this.texture = texture
        // Añadir el sprite a la escena
        scene.add.existing(this);
        scene.physics.world.enable(this)
        this.body.setVelocity(Phaser.Math.Between(20, 35), Phaser.Math.Between(20, 35))
        this.body.setCollideWorldBounds(true)
        this.body.allowGravity = false
        // Configurar propiedades del sprite
        this.setOrigin(0.5, 0.5); // Centrar el punto de origen
        this.setScale(1); // Escalar el sprite
        this.createAnimations(scene)
        this.play("vida")
        scene.time.delayedCall(1500, this.onEliminar, [], this)        
    }

    onEliminar() {
        this.destroy()
    }

    createAnimations(scene) {
        // Crear una animación para el sprite
        if(scene.anims.exists("vida")) return
        scene.anims.create({
            key: 'vida',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
    }
}