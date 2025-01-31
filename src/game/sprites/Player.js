import Phaser from "phaser"

// src/sprites/MiSprite.js
export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture, 0); // Llamar al constructor de la clase padre (Sprite)
        this.texture = texture
        this.vida = 10
        // Añadir el sprite a la escena
        scene.add.existing(this);
        scene.physics.world.enable(this)
        this.body.setCollideWorldBounds(true)
        this.body.allowGravity = false
        // Configurar propiedades del sprite
        this.setOrigin(0.5, 0.5); // Centrar el punto de origen
        this.setScale(1); // Escalar el sprite

        // Crear animación (si es necesario)
        this.createAnimations(scene);

        // Reproducir animación
        this.play('centro');
    }



    createAnimations(scene) {
        // Crear una animación para el sprite
        scene.anims.create({
            key: 'izq',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });

        scene.anims.create({
            key: 'centro',
            frames: [{ key: "player", frame: 4 }],
            frameRate: 12,
            repeat: -1
        });

        scene.anims.create({
            key: 'der',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 5, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

    }
}