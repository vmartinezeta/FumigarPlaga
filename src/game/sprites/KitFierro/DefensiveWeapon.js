// CLASE BASE PARA ARMAS DEFENSIVAS
class DefensiveWeapon extends Phaser.GameObjects.Sprite {
    constructor(scene, texture) {
        super(scene, 0, 0, texture);
        scene.add.existing(this);
        
        this.setActive(false);
        this.setVisible(false);
        this.type = 'defensive';
        this.rotateWithPlayer = false;
        this.duration = null; // null = permanente hasta desactivación manual
    }
    
    onDefend() {
        // Efecto automático (ej: regeneración, aura)
    }
    
    checkCollision(enemy) {
        // Verificar colisión con enemigo
        const distance = Phaser.Math.Distance.Between(
            this.x, this.y, enemy.x, enemy.y
        );
        return distance < this.hitRadius;
    }

    onHit(enemy) {
        // Efecto al golpear enemigo
    }
}

// ESCUDO DEFENSIVO
class Escudo extends DefensiveWeapon {
    constructor(scene) {
        super(scene, 'escudo-texture');
        this.hitRadius = 45;
        this.rotateWithPlayer = true;
        this.damageReduction = 0.5; // Reduce daño recibido en 50%
        this.health = 100;
        
        // Efecto visual de escudo
        this.setAlpha(0.7);
    }
    
    onDefend() {
        // Reducir daño recibido por el jugador
        if (this.scene.player) {
            this.scene.player.damageReduction = this.damageReduction;
        }
    }
    
    onHit(enemy) {
        // El escudo puede dañar enemigos que lo toquen
        enemy.takeDamage(5);
        
        // Efecto visual
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true
        });
        
        // Reducir salud del escudo
        this.health -= 10;
        if (this.health <= 0) {
            this.scene.weaponManager.deactivateDefensiveWeapon('escudo');
        }
    }
}

// LÁTIGO DEFENSIVO
class Latigo extends DefensiveWeapon {
    constructor(scene) {
        super(scene, 'latigo-texture');
        this.hitRadius = 60;
        this.attackRate = 1000; // Cada segundo
        this.lastAttack = 0;
        this.damage = 15;
        
        // Animación de latigo
        this.attackTween = null;
    }
    
    onDefend() {
        const now = this.scene.time.now;
        if (now - this.lastAttack >= this.attackRate) {
            this.attack();
            this.lastAttack = now;
        }
    }
    
    attack() {
        // Animación de ataque
        if (this.attackTween) {
            this.attackTween.stop();
        }
        
        this.attackTween = this.scene.tweens.add({
            targets: this,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            yoyo: true
        });
        
        // Buscar enemigos en radio
        const enemies = this.scene.frogManager.frogs;
        enemies.forEach(enemy => {
            if (this.checkCollision(enemy)) {
                enemy.takeDamage(this.damage);
                
                // Efecto de empuje
                const angle = Phaser.Math.Angle.Between(
                    this.x, this.y, enemy.x, enemy.y
                );
                this.scene.physics.velocityFromRotation(
                    angle, 
                    200, 
                    enemy.body.velocity
                );
            }
        });
    }
}

// CUCHILLO DEFENSIVO
class Cuchillo extends DefensiveWeapon {
    constructor(scene) {
        super(scene, 'cuchillo-texture');
        this.hitRadius = 35;
        this.damage = 25;
        this.rotateWithPlayer = true;
    }
    
    onHit(enemy) {
        // Daño alto a enemigos cercanos
        enemy.takeDamage(this.damage);
        
        // Efecto de sangrado
        enemy.setTint(0xFF0000);
        this.scene.time.delayedCall(1000, () => {
            if (enemy.active) enemy.clearTint();
        });
        
        // Sonido de corte
        this.scene.sound.play('cuchillo-sound');
    }
}