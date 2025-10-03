import Weapon from "./Weapon";

export default class LanzaLlamas extends Weapon {
    constructor(scene, x, y) {
        super(scene, x, y, 'fuego', 'lanzallamas');
        this.setVisible(false);
        this.particles = scene.add.particles(x, y, this.texture, {
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            frequency: 50,
            on: false // Inicialmente apagado
        });
        this.particles.stop(); // No emitir al inicio
    }

    spray(direction, x, y) {
        // Posicionar el emisor en el jugador
        this.particles.setPosition(x, y);
        this.setPosition(x, y);
        this.particles.start(); // Comenzar a emitir

        // Detener después de un tiempo (ej: 500ms)
        this.scene.time.delayedCall(500, () => {
            this.particles.stop();
        });

        // Crear una zona de daño (opcional, si no usas colisión de partículas)
        this.damageZone = this.scene.add.zone(x, y, 100, 20);
        this.scene.physics.world.enable(this.damageZone);
        this.damageZone.body.setAllowGravity(false);

        // Mover la zona de daño en la dirección correcta
        if (direction === 'right') {
            this.damageZone.x += 50;
        } else {
            this.damageZone.x -= 50;
        }

        // Colisión entre la zona de daño y los enemigos
        this.scene.physics.add.overlap(this.damageZone, this.scene.enemiesGroup, (zone, enemy) => {
            enemy.receiveDamage(this.damage);
        });

        // Eliminar la zona de daño después de un tiempo
        this.scene.time.delayedCall(500, () => {
            this.damageZone.destroy();
        });
    }
}