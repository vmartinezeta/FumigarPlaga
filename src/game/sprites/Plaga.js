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
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.body.setVelocity(Phaser.Math.Between(10, 25), Phaser.Math.Between(10, 25)) 
        this.body.setBounce(1).setCollideWorldBounds(true)
        this.body.setAllowGravity(false)
        // Configurar propiedades del sprite
        this.setOrigin(0.5, 0.5); // Centrar el punto de origen
        this.setScale(1); // Escalar el sprite

        // Crear animación (si es necesario)
        this.createAnimations(scene);
        this.darVida = false
        // Reproducir animación
        this.play('animacionSprite')
        scene.time.delayedCall(3000, this.onPuedeDarVida, [], this)
    }

    puedeDarAgua() {
        return this.parido>2
    }

    onPuedeDarVida() {
        this.darVida = true
    }

    puedeDarVida() {
        return this.darVida && this.parido>2
    }

    rotar() {
        this.flipX = !this.flipX
    }

    disabledBody() {
        this.body.setEnable(false)
    }

    createAnimations(scene) {
        // Crear una animación para el sprite
        if(scene.anims.exists("animacionSprite")) return
        scene.anims.create({
            key: 'animacionSprite',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
    }
}