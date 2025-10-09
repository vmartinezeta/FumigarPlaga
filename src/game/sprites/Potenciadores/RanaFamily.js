// RanaFamily.js - Clase base abstracta
import Phaser from "phaser";

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
            rana.family = this; // Referencia a la familia
            rana.familyIndex = i;
            this.add(rana);
        }
    }

    // Método abstracto - debe implementarse en clases hijas
    createRana(x, y, index) {
        throw new Error("Método createRana debe ser implementado en clase hija");
    }

    markForPowerup() {
        // Seleccionar potenciador aleatorio para este grupo
        const powerupTypes = ['superFuria', 'megaHealth', 'timeSlow', 'multiShot', 'invincibility'];
        this.powerupType = Phaser.Utils.Array.GetRandom(powerupTypes);


        // Aplicar efectos visuales a todas las ranas del grupo
        this.children.entries.forEach((rana, index) => {
            this.markRanaAsSpecial(rana, index);
        });

        console.log(`🎯 Familia ${this.familyType} marcada con potenciador: ${this.powerupType}`);
    }

    markRanaAsSpecial(rana, index) {
        // Color distintivo según el tipo de potenciador
        const colors = {
            superFuria: 0xff4500,    // Rojo anaranjado
            megaHealth: 0x00ff00,    // Verde
            timeSlow: 0x00ffff,      // Cian
            multiShot: 0xffff00,     // Amarillo
            invincibility: 0xff00ff  // Magenta
        };

        // Aplicar tint y efectos visuales
        rana.setTint(colors[this.powerupType]);

        // Crear aura alrededor de la rana
        const aura = this.scene.add.circle(rana.x, rana.y, rana.width * 0.8, colors[this.powerupType], 0.3);
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
        this.createRanaParticles(rana, colors[this.powerupType]);
    }

    createRanaParticles(rana, color) {
        const particles = this.scene.add.particles(rana.x, rana.y, 'powerup_particle', {
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

        // Hacer que las partículas sigan a la rana
        
        // this.scene.events.on('update', () => {
        //     if (rana.active && particles.active) {
        //         particles.setPosition(rana.x, rana.y);
        //     }
        // });
    }

    setupFamily() {
        // Configurar colisiones del grupo
        // this.scene.physics.add.collider(this, this.scene.player, this.onPlayerCollision, null, this);

        // Escuchar eventos de muerte de ranas individuales
        this.children.entries.forEach(rana => {
            rana.on('destroy', this.onRanaDead, this);
        });
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

        console.log(`💀 Rana eliminada. Quedan: ${aliveRanas.length}/${this.ranaCount}`);

        if (aliveRanas.length === 0) {
            this.onFamilyDestroyed();
        }
    }

    onFamilyDestroyed() {
        if (!this.isAlive) return;

        this.isAlive = false;
        console.log(`🎉 Familia ${this.familyType} completamente eliminada!`);

        // Soltar potenciador en el centro del grupo
        this.dropPowerup();

        // Emitir evento para el sistema de puntuación
        this.scene.eventBus.emit('familyDestroyed', {
            familyType: this.familyType,
            powerupType: this.powerupType,
            position: { x: this.centerX, y: this.centerY }
        });

        // Destruir el grupo después de un breve delay
        // this.scene.physics.world.removeCollider(this.collider);
        // this.scene.time.removeEvent(this.timer);
        // this.scene.time.delayedCall(1000, () => {
            // this.destroy();
        // });
    }

    dropPowerup() {
        // Crear potenciador especial en el centro del grupo
        const powerup = this.scene.potenciadorGroup.create(this.centerX, this.centerY, `tanque`);
        powerup.type = this.powerupType;
        powerup.powerupClass = 'group';
        powerup.isSuper = true;

        // Efectos especiales para potenciador de grupo
        this.createPowerupEffects(powerup);

        console.log(`🎁 Potenciador ${this.powerupType} dropeado por familia ${this.familyType}`);
    }

    createPowerupEffects(powerup) {
        // Partículas de celebración
        const particles = this.scene.add.particles(powerup.x, powerup.y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            lifespan: 2000,
            quantity: 20,
            emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 30) }
        });

        // Animación de aparición
        powerup.setScale(0);
        this.scene.tweens.add({
            targets: powerup,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Animación flotante
        this.scene.tweens.add({
            targets: powerup,
            y: powerup.y - 20,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Auto-destrucción después de tiempo
        this.scene.time.delayedCall(15000, () => {
            if (powerup.active) {
                particles.destroy();
                powerup.destroy();
            }
        });
    }

    update() {
        // Actualizar posición de auras y partículas
        if (!this.isAlive) return;
        this.children.entries.forEach(rana => {
            if (rana.active && rana.aura) {
                rana.aura.setPosition(rana.x, rana.y);
            }
        });
    }

    // destroy(fromScene, destroyChildren) {
    //     // Limpiar recursos antes de destruir
    //     this.children.entries.forEach(rana => {
    //         if (rana.aura) rana.aura.destroy();
    //         if (rana.particles) rana.particles.destroy();
    //     });

    //     super.destroy(fromScene, destroyChildren);
    // }

}