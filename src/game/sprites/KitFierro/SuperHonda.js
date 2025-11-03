import Fierro from "./Fierro";

export default class SuperHonda extends Fierro {
    constructor(scene) {
        super(scene, 0, 0, 'bomb', 'icon-honda', 'superHonda', 8);
        this.fireRate = 1500;
        this.damage = 30;
        this.angle = 0;
        this.gap = 12;
        this.grupo = null;
        this.timer = null;
        this.particles = [];
    }

    shoot(direction, playerX, playerY, plagaGroup) { 
        this.nextShot();
        this.body.setEnable(true);
        this.grupo = this.scene.physics.add.group();
        // Lógica de disparo específica de honda
        const speed = 300;
        this.baseAngle = direction.right() ? 0 : Math.PI;

        const particle = this.grupo.create(playerX, playerY - this.gap, this.imageKey);
        particle.setScale(.92)
        particle.setDepth(5);
        particle.body.setVelocity(
            Math.cos(this.baseAngle) * speed,
            0
        );
        this.particles.push(particle)

        const particle2 = this.grupo.create(playerX, playerY, this.imageKey);
        particle2.setScale(.96);
        particle2.setDepth(5);
        particle2.body.setVelocity(
            Math.cos(this.baseAngle) * speed,
            0
        );
        this.particles.push(particle2)

        this.setPosition(playerX, playerY);
        this.body.setVelocity(Math.cos(this.baseAngle) * speed,0);

        const particle3 = this.grupo.create(playerX, playerY + this.gap, this.imageKey);
        particle3.setDepth(5);
        particle3.body.setVelocity(
            Math.cos(this.baseAngle) * speed,
            0
        );
        this.particles.push(particle3)

        this.scene.physics.add.overlap(this, plagaGroup, this.handleCollision, null, this);

        // Auto-destrucción después de tiempo
        this.timer = this.scene.time.delayedCall(this.fireRate, this.finParticle, [], this);
    }

    finParticle() {
        this.scene.time.removeEvent(this.timer);
        this.body.setEnable(false);
        for (const child of this.particles) {
            this.grupo.remove(child, true, true);
        }
    }

    handleCollision(_, rana) {
        this.finParticle();
        rana.takeDamage(this.damage);
        if (rana.debeMorir()) {
            rana.morir();
        }

        rana.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => rana.clearTint());
        this.createSplashEffect(rana.x, rana.y);
    }

    createSplashEffect(x, y) {
        // Partículas de salpicadura
        const splash = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 600,
            quantity: 3,
            emitting: false
        });

        splash.explode(3);
        this.scene.time.delayedCall(700, () => splash.destroy());
    }

}