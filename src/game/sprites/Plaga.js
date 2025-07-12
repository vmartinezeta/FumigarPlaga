import Phaser  from "phaser"

export default class Plaga extends Phaser.GameObjects.Sprite {
    constructor(scene, origen, texture, hembra) {
        super(scene, origen.x, origen.y, texture, 0)
        this.scene = scene
        this.texture = texture
        this.hembra = hembra
        this.vida = 40
        this.tienePareja = false
        this.estaCogiendo = true
        this.tint = hembra ? 0x00ffff : 0x00ff00 
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.body.setVelocity(Phaser.Math.Between(10, 25), Phaser.Math.Between(10, 25))
        this.body.setBounce(1).setCollideWorldBounds(true)
        this.body.setAllowGravity(false)
        this.setOrigin(1 / 2)
        this.setScale(1)

        this.createAnimations(scene)

        this.play('animacionSprite')
        scene.time.delayedCall(3000, this.onPuedeDarVida, [], this)

    }

    rotar() {
        this.flipX = !this.flipX
    }

    disabledBody() {
        this.body.setEnable(false)
    }

    createAnimations(scene) {
        if(scene.anims.exists("animacionSprite")) return
        scene.anims.create({
            key: 'animacionSprite',
            frames: scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });
    }

    soltar() {
        this.tienePareja = false
        this.estaCogiendo = true
        this.tint = this.hembra ? 0x00ffff : 0x00ff00 
    }

    update() {
        const time = this.scene.time.now - this.scene.time.startTime
        if (this.vida > 0 && time > 1600) {
            this.vida--
            this.scene.time.startTime = time
        }
        
        if (time > 1000 && this.hembra && this.tienePareja) {
            this.estaCogiendo = false
        }
    }    
}