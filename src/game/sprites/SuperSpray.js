export default class SuperSpray {
    constructor(scene, particles, spread, damage = 20) {
        this.scene = scene;
        this.particles = particles;
        this.spread = spread;
        this.damage = damage;
        this.baseAngle = 0;
        this.emitX = 0;
        this.emitY = 0;
    }

    setPosition(x, y) {
        this.emitX = x;
        this.emitY = y;
    }

    createConcentratedSpray(imageKey, scale) {
        // Posición de emisión (ajusta según tu sprite de player)
        const particle = this.particles.create(
            this.emitX,
            this.emitY,
            imageKey
        );
        particle.setAlpha(1);
        particle.setScale(scale || 0.4);
        particle.setDepth(5);

        // const spread = Math.PI / 6; // 30° de dispersión
        const angle = this.baseAngle + Phaser.Math.FloatBetween(-this.spread, this.spread);
        const speed = Phaser.Math.Between(300, 400);

        this.scene.physics.add.existing(particle);
        particle.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Gravedad para efecto de arco
        particle.body.setGravityY(200);
        particle.body.setBounce(0.2, 0.2);

        this.scene.time.delayedCall(1000, this.autoDestruccion, [particle], this);
        return particle;
    }

    autoDestruccion(particle) {
        particle.destroy();
    }

}