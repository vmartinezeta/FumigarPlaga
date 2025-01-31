import Phaser from 'phaser'
// src/sprites/MiSprite.js
export default class TanqueConAgua extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture, 0); // Llamar al constructor de la clase padre (Sprite)
        this.texture = texture
        // Añadir el sprite a la escena
        scene.add.existing(this);

        // Configurar propiedades del sprite
        this.setOrigin(0.5, 0.5); // Centrar el punto de origen
        this.setScale(1); // Escalar el sprite
    }

    createAnimations(scene) {
        // Crear una animación para el sprite
        scene.anims.create({
            key: 'animacionSprite',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }
}