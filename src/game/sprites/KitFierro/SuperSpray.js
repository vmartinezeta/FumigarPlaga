import Phaser from "phaser";

export default class SuperSpray extends Phaser.GameObjects.Group {
    constructor(scene, spread, damage, iterationCount) {
        super(scene);
        this.spread = spread;
        this.damage = damage;
        this.baseAngle = 0;
        this.emitX = 0;
        this.emitY = 0;
        this.iterationCount = iterationCount;
        this.oldIterationCount = iterationCount;
    }

    reset() {
        this.iterationCount = this.oldIterationCount;
    }

    vacio() {
        return this.iterationCount === 0;
    }

    setOrigen(x, y) {
        this.emitX = x;
        this.emitY = y;
        return this;
    }

    setAngle(angle) {
        this.baseAngle = angle;
        return this;
    }

    createParticle(imageKey, scale) {
        this.iterationCount--;
        const particle = this.create(
            this.emitX,
            this.emitY,
            imageKey
        );
        particle.setAlpha(1);
        particle.setScale(scale || 0.4);
        particle.setDepth(5);
        

        // const spread = Math.PI / 6; // 30° de dispersión
        const angle = this.baseAngle + Phaser.Math.FloatBetween(-this.spread, this.spread);
        const speed = Phaser.Math.Between(400, 500);

        this.scene.physics.add.existing(particle);
        particle.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Gravedad para efecto de arco
        particle.body.setGravityY(200);
        particle.body.setBounce(0.2, 0.2);

        this.scene.time.delayedCall(1200, this.autoDestruccion, [particle], this);
        return particle;
    }

    autoDestruccion(particle) {
        particle.destroy();
    }

}