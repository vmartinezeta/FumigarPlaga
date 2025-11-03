import Rana from "../Enemigos/Rana";
import RanaStaticFamily from "../Potenciadores/RanaStaticFamily";
import Fierro from "./Fierro";
import Phaser from "phaser";


export default class LanzaHumo extends Fierro {
    constructor(scene) {
        super(scene, 0, 0, 'humo', 'icon-lanzaHumo', 'lanzaHumo', 10);
        this.smokeCloud = null;
        this.particles = null;
        this.fireRate = 2000;
        this.damage = 5;
    }

    shoot(direction, playerX, playerY, plagaGroup) {
        this.nextShot();
        // 1. Crear efecto visual de humo (partículas)
        this.createSmokeParticles(playerX, playerY, direction);
        
        // 2. Crear sprite invisible para la nube de humo (colisión)
        this.createSmokeCloud(playerX, playerY, direction, plagaGroup);
    }

    createSmokeParticles(x, y, direction) {
        const offsetY = -10; // Ajusta este valor para que el fuego salga de la parte superior del jugador (como el hombro)
        const offsetX = direction.right() ? 100 : -100; // Ajusta para que salga del frente del jugador

        const emitX = x + offsetX;
        const emitY = y + offsetY;

        this.particles = this.scene.add.particles(emitX, emitY, this.imageKey, {
            speed: { min: 10, max: 30 },
            scale: { start: 0.8, end: 0 },
            lifespan: this.fireRate,
            quantity: 2,
            frequency: 100, // Emitir 2 partículas cada 100ms
            blendMode: 'SCREEN',
            emitZone: {
                type: 'source',
                source: new Phaser.Geom.Circle(direction.right() ? emitX : emitX - 80, y, 10)
            }
        });

        // Expansión de la nube de partículas
        this.scene.tweens.add({
            targets: this.particles,
            scaleX: 3,
            scaleY: 3,
            duration: this.fireRate,
            onComplete: () => {
                this.particles.destroy();
            }
        });
    }

    createSmokeCloud(x, y, direction, plagaGroup) {
        const targetX = direction.right() ? x + 100 : x - 100;

        // Sprite invisible para la nube de humo
        this.smokeCloud = this.scene.physics.add.sprite(targetX, y, this.imageKey);
        this.smokeCloud.setVisible(false);
        this.smokeCloud.body.setImmovable(true);
        this.smokeCloud.body.setAllowGravity(false);

        // Ajustar el tamaño de la hitbox para que coincida con la nube visual
        // Comienza pequeña y se expande
        this.smokeCloud.body.setSize(40, 40);

        // Expansión de la hitbox
        this.scene.tweens.add({
            targets: this.smokeCloud,
            scaleX: 2.5,
            scaleY: 2.5,
            duration: this.fireRate,
            onUpdate: () => {
                // Ajustar el tamaño del cuerpo de colisión durante la expansión
                if (this.smokeCloud && this.smokeCloud.body) {
                    this.smokeCloud.body.setSize(40 * this.smokeCloud.scaleX, 40 * this.smokeCloud.scaleY);
                }
            },
            onComplete: () => {
                if (this.smokeCloud) {
                    this.smokeCloud.destroy();
                }
                this.smokeCloud = null;
            }
        });

        // Colisión con enemigos
        const ranas = plagaGroup.children.entries.filter(child => child instanceof Rana);
        this.scene.physics.add.overlap(this.smokeCloud, ranas, this.handleCollision, null, this);

        const families = plagaGroup.children.entries.filter(child => child instanceof RanaStaticFamily);
        families.forEach(family => {
            family.collider = this.scene.physics.add.overlap(this.smokeCloud, family, this.handleCollision, null, this);
        });
    }

    handleCollision(_, rana) {
        rana.disminuirVelocidad();
        rana.takeDamage(this.damage);
        if (rana.debeMorir()) {
            rana.morir();
        }
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