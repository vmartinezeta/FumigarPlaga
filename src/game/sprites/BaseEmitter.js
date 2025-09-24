import Phaser from "phaser";

export default class BaseEmitter extends Phaser.GameObjects.Group {
    constructor(scene, imageKey) {
        super(scene);
        this.scene = scene;
        this.imageKey = imageKey;
        this.estaFuera = false;
        this.damage = 10;
        this.lastEmitTime = 0;

        this.emitRate = 60; // ms entre partículas

        this.particleLifespan = 1500;

        scene.physics.add.existing(this);
    }

    chorrito() {}

    flujoFuerte() {}

    avanico() {}

    radial() {}

    emitParticles() {
        const particle = this.get();        
        if (!particle) return;

        // Posición de emisión (ajusta según tu sprite de player)
        const offsetX = this.scene.player.control.right() ? -30 : 30;
        const emitX = this.scene.player.x + offsetX;
        const emitY = this.scene.player.y - 15;

        // Reactivar partícula
        particle.setActive(true)
            .setVisible(true)
            .setPosition(emitX, emitY)
            .setAlpha(1)
            .setScale(0.4)
            .setDepth(10)
            .setTexture(this.imageKey);

        // Velocidad basada en dirección del player
        const baseAngle = this.scene.player.control.right() ? 0: Math.PI; // 180° o 0°
        const spread = Math.PI / 6; // 30° de dispersión
        const angle = baseAngle + Phaser.Math.FloatBetween(-spread, spread);
        const speed = Phaser.Math.Between(300, 400);

        const physicsBody = this.scene.physics.add.existing(particle);
    
        physicsBody.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Gravedad para efecto de arco
        physicsBody.body.setGravityY(200);
        physicsBody.body.setBounce(0.2, 0.2);

        // Tiempo de vida
        particle.spawnTime = this.scene.time.now;
    }

    updateParticlesLifecycle(currentTime) {
        this.getChildren().forEach(particle => {
            if (!particle.active) return;

            const aliveTime = currentTime - particle.spawnTime;
            const lifeProgress = aliveTime / this.particleLifespan;

            // Desvanecimiento gradual
            particle.setAlpha(1 - (lifeProgress * 0.8));
            particle.setScale(0.4 * (1 - (lifeProgress * 0.5)));

            // Destruir cuando expire el tiempo
            if (aliveTime > this.particleLifespan) {
                particle.destroy();
            }
        });
    }

    update(time) { 
        this.updateParticlesLifecycle(time);
    }
}