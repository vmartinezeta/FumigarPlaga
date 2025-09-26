export default class SuperSpray {
    constructor(scene, imageKey, spread, damage = 20) {
        this.scene = scene;
        this.imageKey = imageKey;
        this.spread = spread;
        this.damage = damage;
        this.sprayRate = 100;
        this.estaFuera = false;
    }

    createConcentratedSpray() {
        // Posición de emisión (ajusta según tu sprite de player)
        const offsetX = this.scene.player.control.right() ? -30 : 30;
        const emitX = this.scene.player.x + offsetX;
        const emitY = this.scene.player.y - 15;
        const particle = this.scene.particles.create(
            emitX,
            emitY,
            this.imageKey
        )
        particle.setAlpha(1);
        particle.setScale(0.4);
        particle.setDepth(5);

        const baseAngle = this.scene.player.control.right() ? 0 : Math.PI; // 180° o 0°
        // const spread = Math.PI / 6; // 30° de dispersión
        const angle = baseAngle + Phaser.Math.FloatBetween(-this.spread, this.spread);
        const speed = Phaser.Math.Between(300, 400);

        this.scene.physics.add.existing(particle);
        particle.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Gravedad para efecto de arco
        particle.body.setGravityY(200);
        particle.body.setBounce(0.2, 0.2);

        this.scene.time.delayedCall(2000, this.autoDestruccion, [particle], this);
        return particle;
    }

    autoDestruccion(particle) {
        particle.destroy();
    }

}