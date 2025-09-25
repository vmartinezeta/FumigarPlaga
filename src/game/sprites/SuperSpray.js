import Phaser from "phaser";


export default class SuperSpray  extends Phaser.GameObjects.Group {
    constructor(scene, imageKey) {
        super(scene);
        this.scene = scene;
        this.imageKey = imageKey;
        this.estaFuera = false;
        this.damage = 10;
        this.lastEmitTime = 0;
        this.id = 1;

        this.emitRate = 60; // ms entre partículas

        this.particleLifespan = 1500;

        scene.physics.add.existing(this);
    }

    emitParticles(spread, gravity) {
        // Posición de emisión (ajusta según tu sprite de player)
        const offsetX = this.scene.player.control.right() ? -30 : 30;
        const emitX = this.scene.player.x + offsetX;
        const emitY = this.scene.player.y - 15;
        const particle = this.create(
            emitX,
            emitY,
            this.imageKey
        ).setAlpha(1)
        .setScale(0.4)
        .setDepth(10);

        const baseAngle = this.scene.player.control.right() ? 0 : Math.PI; // 180° o 0°
        // const spread = Math.PI / 6; // 30° de dispersión
        const angle = baseAngle + Phaser.Math.FloatBetween(-spread, spread);
        const speed = Phaser.Math.Between(300, 400);


        if (particle) {
            this.scene.physics.add.existing(particle);
            particle.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );

            // particle.body.setCollideWorldBounds(true);
            // Gravedad para efecto de arco
            particle.body.setGravityY(gravity);
            particle.body.setBounce(0.2, 0.2);

        }

        this.scene.time.delayedCall(2000, this.autoDestruccion, [particle], this);
    }
    
    autoDestruccion(particle) {
        particle.destroy();
    }

    lanzar() {
        this.id = 1;
        this.damage = 20;
        this.emitParticles(Math.PI/6, 200);
        this.estaFuera = true;
    }

    soltar() {
        this.estaFuera = false;
    }

    chorrito() {
        this.id = 2;
        this.damage = 10;
        this.emitParticles(Math.PI/4, 200);
    }

    avanico() {
        this.id = 3;
        this.damage = 2;
        this.emitParticles(Math.PI/4, 200);
    }

    isRoca() {
        return this.id === 1;
    }

    isChorrito() {
        return this.id === 2;
    }

    isAvanico() {
        return this.id === 3;
    }
}