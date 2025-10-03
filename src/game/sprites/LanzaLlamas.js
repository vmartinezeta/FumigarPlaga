import Weapon from "./Weapon";
import Phaser from "phaser";

export default class LanzaLlamas extends Weapon {
    constructor(scene, x, y) {
        super(scene, x, y, "fuego", 'lanzallamas');
        this.damageZone = null;
        this.particles = null;
    }

    spray(direction, playerX, playerY) {
        // 1. Crear el efecto visual de llamas (partículas)
        this.createFlameParticles(playerX, playerY, direction);

        // 2. Crear un sprite invisible para la zona de daño
        this.createDamageZone(playerX, playerY, direction);
    }

    createFlameParticles(x, y, direction) {

        // Ajustar la posición de emisión: un poco arriba del centro del jugador
        const offsetY = -10; // Ajusta este valor para que el fuego salga de la parte superior del jugador (como el hombro)
        const offsetX = direction === 'right' ? 15 : -15; // Ajusta para que salga del frente del jugador

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
                    direction === 'right' ? emitX : emitX - 80,
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
        this.damageZone = this.scene.add.sprite(
            direction === 'right' ? x + 40 : x - 40,
            y,
            this.imageKey
        );
        this.damageZone.setVisible(false);
        this.scene.physics.world.enable(this.damageZone);

        // Ajustar el tamaño de la hitbox según el "caudal" del lanzallamas
        // Puedes ajustar el ancho y alto para simular el flujo
        this.damageZone.body.setSize(80, 30);

        // Colisión con enemigos
        this.scene.physics.add.overlap(this.damageZone, this.scene.enemies, (zone, enemy) => {
            enemy.receiveDamage(this.damage);
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