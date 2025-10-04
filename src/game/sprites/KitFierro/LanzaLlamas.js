import Fierro from "./Fierro";
import Phaser from "phaser";

export default class LanzaLlamas extends Fierro {
    constructor(scene) {
        super(scene, 0, 0, "fuego", 'lanzallamas', 10);
        this.damageZone = null;
        this.particles = null;
        this.damage = 20;
        this.setVisible(false);
    }

    spray(direction, playerX, playerY) {
        this.body.setEnable(true);
        // 1. Crear el efecto visual de llamas (partículas)
        this.createFlameParticles(playerX, playerY, direction);

        // 2. Crear un sprite invisible para la zona de daño
        this.createDamageZone(playerX, playerY, direction);
    }

    createFlameParticles(x, y, direction) {

        // Ajustar la posición de emisión: un poco arriba del centro del jugador
        const offsetY = -10; // Ajusta este valor para que el fuego salga de la parte superior del jugador (como el hombro)
        const offsetX = direction.right() ? 100 : -100; // Ajusta para que salga del frente del jugador

        const emitX = x + offsetX;
        const emitY = y + offsetY;

        // Debug: dibujar un punto en la posición de emisión
        // Configurar el emitter para el efecto visual

        this.particles = this.scene.add.particles(emitX, emitY, this.imageKey, {
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            lifespan: 300,
            quantity: 5,
            frequency: 50, // Emitir 5 partículas cada 50ms
            blendMode: 'ADD',
            emitZone: {
                type: 'source',
                source: new Phaser.Geom.Rectangle(
                    direction.right() ? emitX : emitX - 80,
                    emitY,
                    80, 30
                )
            }
        });

        // Detener el emitter después de 300ms
        this.scene.time.delayedCall(300, () => {
            this.particles.stop();
        });
    }

    createDamageZone(x, y, direction) {
        // Debug: dibujar un punto en la posición de emisión
        // Crear un sprite invisible para la zona de daño
        this.damageZone = this.scene.physics.add.sprite(
            direction.right()?x+100:x-100,
            y,
            this.imageKey
        );
        this.damageZone.setVisible(false);
        this.damageZone.body.setImmovable(true);
        this.damageZone.body.setAllowGravity(false);
        // this.scene.physics.world.enable(this.damageZone);

        // Ajustar el tamaño de la hitbox según el "caudal" del lanzallamas
        // Puedes ajustar el ancho y alto para simular el flujo
        this.damageZone.body.setSize(80, 30);

        // Colisión con enemigos
        this.scene.physics.add.overlap(this.damageZone, this.scene.plagaGroup, (_, rana) => {
            rana.takeDamage(this.damage);
            if (rana.debeMorir()) {
                rana.morir();
            }
        });

        // Destruir la zona de daño después de 300ms
        this.scene.time.delayedCall(300, () => {
            if (this.damageZone) {
                this.damageZone.destroy();
            }
            this.damageZone = null;
        });
    }

    cleanup() {
        // Limpiar partículas y zona de daño si existen
        if (this.particles) {
            this.particles.destroy();
        }
        if (this.damageZone) {
            this.damageZone.destroy();
        }
    }
}