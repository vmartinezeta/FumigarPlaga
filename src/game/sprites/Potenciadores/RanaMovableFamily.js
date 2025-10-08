import Rana from "../Enemigos/Rana";
import RanaFamily from "./RanaFamily";

// RanaMovableFamily.js
export default class RanaMovableFamily extends RanaFamily {
    constructor(scene, x, y, ranaCount = 5, radius = 80, movementRadius = 120) {
        super(scene, x, y, 'movable', ranaCount, radius);
        this.movementRadius = movementRadius;
        this.movementAngle = 0;
        this.movementSpeed = 0.002; // Velocidad de rotación

        this.setupMovableBehavior();
    }
    
    createRana(x, y, index) {
        // Crear rana móvil
        const type = Math.random()*2;
        const rana = new Rana(this.scene, x, y, 'rana', Boolean(type), true, 20);
        
        // Configurar propiedades específicas de ranas móviles
        rana.health = 20;
        rana.maxHealth = 20;
        rana.speed = 50;
        rana.damage = 20;
        rana.isStatic = false;
        rana.originalAngle = (index / this.ranaCount) * Math.PI * 2;
        
        // Configurar física
        rana.body.setSize(18, 18);
        rana.body.setOffset(7, 7);
        
        return rana;
    }
    
    setupMovableBehavior() {
        // Comportamiento específico para ranas móviles
        this.movementPattern = 'circle'; // 'circle', 'follow', 'random'
        this.lastMovementChange = 0;
        this.movementChangeInterval = 2000; // Cambiar cada 2 segundos
    }
    
    update(time, delta) {
        super.update();
        
        if (!this.isAlive) return;
        
        this.movementAngle += this.movementSpeed * delta;
        
        // Actualizar posición de todas las ranas según el patrón de movimiento
        this.children.entries.forEach((rana, index) => {
            if (rana.active) {
                this.updateRanaMovement(rana, index, time);
            }
        });
        
        // Cambiar patrón de movimiento periódicamente
        if (time > this.lastMovementChange + this.movementChangeInterval) {
            this.changeMovementPattern();
            this.lastMovementChange = time;
        }
    }
    
    updateRanaMovement(rana, index, time) {
        switch (this.movementPattern) {
            case 'circle':
                this.circleMovement(rana, index, time);
                break;
            case 'follow':
                this.followMovement(rana, time);
                break;
            case 'random':
                this.randomMovement(rana, time);
                break;
        }
    }
    
    circleMovement(rana, index, time) {
        // Movimiento circular alrededor del centro del grupo
        const angle = rana.originalAngle + this.movementAngle;
        const targetX = this.centerX + Math.cos(angle) * this.radius;
        const targetY = this.centerY + Math.sin(angle) * this.radius;
        
        // Movimiento suave hacia la posición objetivo
        this.scene.physics.moveTo(rana, targetX, targetY, rana.speed);
    }
    
    followMovement(rana, time) {
        // Perseguir al jugador pero manteniéndose cerca del grupo
        const player = this.scene.player;
        const angleToPlayer = Phaser.Math.Angle.Between(rana.x, rana.y, player.x, player.y);
        
        // Calcular posición objetivo (no demasiado cerca del jugador)
        const distanceToPlayer = Phaser.Math.Distance.Between(rana.x, rana.y, player.x, player.y);
        const desiredDistance = 100;
        
        if (distanceToPlayer > desiredDistance) {
            const targetX = player.x - Math.cos(angleToPlayer) * desiredDistance;
            const targetY = player.y - Math.sin(angleToPlayer) * desiredDistance;
            
            this.scene.physics.moveTo(rana, targetX, targetY, rana.speed);
        } else {
            // Mantener distancia
            rana.body.setVelocity(0, 0);
        }
    }
    
    randomMovement(rana, time) {
        // Movimiento aleatorio dentro del área del grupo
        if (!rana.moveTarget || Phaser.Math.Distance.Between(rana.x, rana.y, rana.moveTarget.x, rana.moveTarget.y) < 10) {
            // Nuevo objetivo aleatorio
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * this.movementRadius;
            
            rana.moveTarget = {
                x: this.centerX + Math.cos(angle) * distance,
                y: this.centerY + Math.sin(angle) * distance
            };
        }
        
        this.scene.physics.moveTo(rana, rana.moveTarget.x, rana.moveTarget.y, rana.speed * 0.5);
    }
    
    changeMovementPattern() {
        const patterns = ['circle', 'follow', 'random'];
        const currentIndex = patterns.indexOf(this.movementPattern);
        const nextIndex = (currentIndex + 1) % patterns.length;
        
        this.movementPattern = patterns[nextIndex];
        
        console.log(`🔄 Familia móvil cambió a patrón: ${this.movementPattern}`);
        
        // Efecto visual al cambiar patrón
        this.children.entries.forEach(rana => {
            if (rana.active) {
                rana.setTint(0xffffff);
                this.scene.tweens.add({
                    targets: rana,
                    tint: this.getPowerupColor(this.powerupType),
                    duration: 500
                });
            }
        });
    }
    
    getPowerupColor(powerupType) {
        const colors = {
            superFuria: 0xff4500,
            megaHealth: 0x00ff00,
            timeSlow: 0x00ffff,
            multiShot: 0xffff00,
            invincibility: 0xff00ff
        };
        return colors[powerupType] || 0xffffff;
    }
}