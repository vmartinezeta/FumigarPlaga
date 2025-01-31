import Phaser  from "phaser"

export default class Plaga extends Phaser.GameObjects.Sprite {

    constructor(scene, origen, texture, hembra) {
        super(scene, origen.x, origen.y, texture, 0); // Llamar al constructor de la clase padre (Sprite)
        this.scene = scene
        this.texture = texture
        this.hembra = hembra
        this.vida = 10
        this.parido = 0
        this.tint = hembra ? 0x00ffff : 0x00ff00 
        // Añadir el sprite a la escena
        scene.add.existing(this);
        scene.physics.world.enable(this)
        this.body.setVelocity(Phaser.Math.Between(30, 40), Phaser.Math.Between(30, 40))
        this.body.setBounce(1).setCollideWorldBounds(true)
        this.body.allowGravity = false        
        // Configurar propiedades del sprite
        this.setOrigin(0.5, 0.5); // Centrar el punto de origen
        this.setScale(1); // Escalar el sprite

        // Crear animación (si es necesario)
        this.createAnimations(scene);

        // Reproducir animación
        this.play('animacionSprite');
    }

    rotar() {
        this.flipX = !this.flipX
        this.scene.add.existing(this);
    }

    createAnimations(scene) {
        // Crear una animación para el sprite
        scene.anims.create({
            key: 'animacionSprite',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
    }
}