import Fierro from "./Fierro";

export default class Honda extends Fierro {
    constructor(scene) {
        super(scene, 0, 0, 'bomb', 'icon-honda', 'honda', 8);
        this.fireRate = 1500;
        this.damage = 15;
    }

    shoot(direction, playerX, playerY, plagaGroup) {
        this.nextShot();
        this.setPosition(playerX, playerY);
        this.setActive(true);
        this.setVisible(true);
        this.body.setEnable(true);

        // Lógica de disparo específica de honda
        const speed = 300;
        this.body.setVelocity(
            direction.right() ? speed : -speed,
            0
        );


        this.scene.physics.add.overlap(this, plagaGroup, this.handleCollision, null, this);

        // Auto-destrucción después de tiempo
        this.scene.time.delayedCall(this.fireRate, this.reset, [], this);
    }

    reset() {
        this.setActive(false);
        this.setVisible(false);
    }

    handleCollision(particle, rana) {  
        if(!this.scene.weaponManager.canDamageHiddenFrog(this.type, rana)) return;
        particle.setActive(false);
        particle.setVisible(false);
        particle.body.setEnable(false);
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