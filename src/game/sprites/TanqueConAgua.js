import Phaser from 'phaser'
// src/sprites/MiSprite.js
export default class TanqueConAgua extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture) {
        super(scene, origen.x, origen.y, texture, 0); // Llamar al constructor de la clase padre (Sprite)
        this.texture = texture
        // Añadir el sprite a la escena
        scene.add.existing(this);
        scene.physics.world.enable(this)
        // Configurar propiedades del sprite
        this.setOrigin(0.5, 0.5); // Centrar el punto de origen
        this.setScale(1); // Escalar el sprite
        // Crear un Timer que ejecute un callback después de 5 segundos
        scene.time.delayedCall(5000, this.onTimerComplete, [], this);

        this.notificacion = scene.add.text(origen.x, origen.y, "NUEVO", {
            fontFamily: 'Arial Black', fontSize: 20, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0).setDepth(100)

        scene.time.delayedCall(1000, this.onEliminarNotificacion, [], this)
    }

    onTimerComplete() {
        this.destroy()
    }

    onEliminarNotificacion() {
        this.notificacion.destroy()
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