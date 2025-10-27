import Phaser from "phaser";
import PowerUpFactory from "./PowerUpFactory";

export default class RanaFamily extends Phaser.GameObjects.Group {
    constructor(scene, x, y, familyType, ranaCount = 5, radius = 80) {
        super(scene);
        this.scene = scene;
        scene.physics.add.existing(this);
        this.familyType = familyType; // 'static' o 'movable'
        this.centerX = x;
        this.centerY = y;
        this.radius = radius;
        this.ranaCount = Math.max(5, ranaCount); // Mínimo 5 ranas
        this.isAlive = true;
        this.powerupType = null;
        this.timer = null;
        this.collider = null;
        // Crear el grupo circular
        this.createCircularFormation();

        // Marcar el grupo para potenciador
        this.markForPowerup();

        // Configurar colisiones y eventos
        this.setupFamily();
    }

    createCircularFormation() {
        const angleStep = (2 * Math.PI) / this.ranaCount;

        for (let i = 0; i < this.ranaCount; i++) {
            const angle = i * angleStep;
            const x = this.centerX + Math.cos(angle) * this.radius;
            const y = this.centerY + Math.sin(angle) * this.radius;

            // Crear rana según el tipo de familia
            const rana = this.createRana(x, y, i);
            rana.family = this.familyType; // Referencia a la familia
            rana.familyIndex = i;
            this.add(rana);
        }
    }

    createRana(x, y, index) {
        throw new Error("createRana(x, y, index), método abstracto.");
    }

    markForPowerup() {
        // Seleccionar potenciador aleatorio para este grupo
        // const powerupTypes = ['superFuria', 'megaHealth', 'timeSlow', 'multiShot', 'invincibility'];
        this.powerupType = PowerUpFactory.createRandomPowerUp(this.scene, this.centerX, this.centerY);

        // Aplicar efectos visuales a todas las ranas del grupo
        this.children.entries.forEach((rana, index) => {
            this.markRanaAsSpecial(rana, index);
        });
    }

    markRanaAsSpecial(rana, index) {
        // Color distintivo según el tipo de potenciador
        // const colors = {
        //     superFuria: 0xff4500,    // Rojo anaranjado
        //     megaHealth: 0x00ff00,    // Verde
        //     timeSlow: 0x00ffff,      // Cian
        //     multiShot: 0xffff00,     // Amarillo
        //     invincibility: 0xff00ff  // Magenta
        // };

        // Aplicar tint y efectos visuales
        // rana.setTint(colors[this.powerupType]);
        rana.setTint(this.powerupType.color);
        // Crear aura alrededor de la rana
        const aura = this.scene.add.circle(rana.x, rana.y, rana.width * 0.8, this.powerupType.color, 0.3);
        aura.setDepth(rana.depth - 1);
        rana.aura = aura;

        // Animación de pulsación para el aura
        this.scene.tweens.add({
            targets: aura,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Partículas especiales para ranas de grupo
        this.createRanaParticles(rana, this.powerupType.color);
    }

    createRanaParticles(rana, color) {
        const particles = this.scene.add.particles(rana.x, rana.y, "particle", {
            speed: { min: 5, max: 15 },
            scale: { start: 0.3, end: 0 },
            tint: color,
            blendMode: 'ADD',
            lifespan: 1500,
            frequency: 200,
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Circle(0, 0, rana.width * 0.6)
            }
        });

        rana.particles = particles;
    }

    setupFamily() {
        // Configurar colisiones del grupo
        this.scene.physics.add.collider(this.scene.player, this, this.onPlayerCollision, null, this);

        // Escuchar eventos de muerte de ranas individuales
        this.children.entries.forEach(rana => {
            rana.on('destroy', this.onRanaDead, this);
        });
    }

    onPlayerCollision(player, rana) {
        rana.morir();
        this.scene.eventBus.emit("playerHealthChanged", { player });
        this.scene.eventBus.emit("scoreChanged", { puntuacion: rana.vidaMax });
    }

    onRanaDead(deadRana) {
        // Limpiar efectos visuales de la rana muerta
        if (deadRana.aura) {
            deadRana.aura.destroy();
        }
        if (deadRana.particles) {
            deadRana.particles.destroy();
        }

        // Verificar si todas las ranas del grupo están muertas
        const aliveRanas = this.children.entries.filter(rana => rana.active && rana.vida > 0);

        if (aliveRanas.length === 0) {
            this.onFamilyDestroyed();
        }
    }

    onFamilyDestroyed() {
        if (!this.isAlive) return;
        this.isAlive = false;

        // Soltar potenciador en el centro del grupo
        this.dropPowerup();

        // Emitir evento para el sistema de puntuación
        this.scene.eventBus.emit('familyDestroyed', {
            family: this,
            familyType: this.familyType,
            powerupType: this.powerupType,
            position: { x: this.centerX, y: this.centerY }
        });
    }

    dropPowerup() {
        // Crear potenciador especial en el centro del grupo
        this.scene.potenciadorGroup.add(this.powerupType);
        this.powerupType.start();

        // Efectos especiales para potenciador de grupo
        this.createPowerupEffects();
    }

    createPowerupEffects() {
        // Partículas de celebración
        const particles = this.scene.add.particles(this.centerX, this.centerY, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            lifespan: 1500,
            quantity: 20,
            emitZone: { type: 'source', source: new Phaser.Geom.Circle(0, 0, 30) }
        });


        // Auto-destrucción después de tiempo
        this.scene.time.delayedCall(1500, () => {
            particles.stop();
            particles.destroy();
        });
    }

    // update() {
    //     // Actualizar posición de auras y partículas
    //     if (!this.isAlive) return;
    //     this.children.entries.forEach(rana => {
    //         if (rana.active && rana.aura) {
    //             rana.aura.setPosition(rana.x, rana.y);
    //         }
    //     });
    // }

    // destroy(fromScene, destroyChildren) {
    //     // Limpiar recursos antes de destruir
    //     this.children.entries.forEach(rana => {
    //         if (rana.aura) rana.aura.destroy();
    //         if (rana.particles) rana.particles.destroy();
    //     });

    //     super.destroy(fromScene, destroyChildren);
    // }

}