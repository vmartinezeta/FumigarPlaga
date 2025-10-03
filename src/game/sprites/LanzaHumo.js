export default class SmokeLauncher extends Weapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'smoke_launcher', 'lanzaHumo');
        this.smokeCloud = null;
        this.particles = null;
    }

    launchSmoke(playerX, playerY, direction) {
        // 1. Crear efecto visual de humo (partículas)
        this.createSmokeParticles(playerX, playerY, direction);

        // 2. Crear sprite invisible para la nube de humo (colisión)
        this.createSmokeCloud(playerX, playerY, direction);
    }

    createSmokeParticles(x, y, direction) {
        const targetX = direction === 'right' ? x + 100 : x - 100;

        this.particles = this.scene.add.particles(targetX, y, 'smoke_particle', {
            speed: { min: 10, max: 30 },
            scale: { start: 0.8, end: 0 },
            lifespan: 2000,
            quantity: 2,
            frequency: 100, // Emitir 2 partículas cada 100ms
            blendMode: 'SCREEN',
            emitZone: { 
                type: 'random', 
                source: new Phaser.Geom.Circle(targetX, y, 10) 
            }
        });

        // Expansión de la nube de partículas
        this.scene.tweens.add({
            targets: this.particles,
            scaleX: 3,
            scaleY: 3,
            duration: 2000,
            onComplete: () => {
                this.particles.destroy();
            }
        });
    }

    createSmokeCloud(x, y, direction) {
        const targetX = direction === 'right' ? x + 100 : x - 100;

        // Sprite invisible para la nube de humo
        this.smokeCloud = this.scene.add.sprite(targetX, y, null);
        this.scene.physics.world.enable(this.smokeCloud);
        
        // Ajustar el tamaño de la hitbox para que coincida con la nube visual
        // Comienza pequeña y se expande
        this.smokeCloud.body.setSize(40, 40);

        // Expansión de la hitbox
        this.scene.tweens.add({
            targets: this.smokeCloud,
            scaleX: 2.5,
            scaleY: 2.5,
            duration: 2000,
            onUpdate: () => {
                // Ajustar el tamaño del cuerpo de colisión durante la expansión
                this.smokeCloud.body.setSize(40 * this.smokeCloud.scaleX, 40 * this.smokeCloud.scaleY);
            },
            onComplete: () => {
                this.smokeCloud.destroy();
                this.smokeCloud = null;
            }
        });

        // Colisión con enemigos
        this.scene.physics.add.overlap(this.smokeCloud, this.scene.enemies, (cloud, enemy) => {
            enemy.slowDown(0.5); // Reducir velocidad a la mitad
        });
    }

    cleanup() {
        if (this.particles) {
            this.particles.destroy();
        }
        if (this.smokeCloud) {
            this.smokeCloud.destroy();
        }
    }
}