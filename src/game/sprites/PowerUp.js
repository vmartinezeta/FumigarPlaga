// PowerUp.js
export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, `powerup-${type}`);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.type = type;
        this.duration = 10000; // 10 segundos
        this.isActive = false;
        this.placementRadius = 100; // Radio de efecto
        
        this.setInteractive({ draggable: true });
        this.setScale(0.8);
        this.setCollideWorldBounds(true);
        this.setBounce(0.3, 0.3);
        
        this.setupBehavior();
    }
    
    setupBehavior() {
        // Animación flotante
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Efecto visual de radio
        this.radiusIndicator = this.scene.add.circle(this.x, this.y, this.placementRadius, 0x00ff00, 0.2)
            .setVisible(false);
    }
    
    placePowerUp(x, y) {
        this.setPosition(x, y);
        this.isActive = true;
        this.setVelocity(0, 0);
        this.setImmovable(true);
        
        // Mostrar radio de efecto
        this.radiusIndicator.setPosition(x, y).setVisible(true);
        
        // Activar efecto según tipo
        this.activateEffect();
        
        // Temporizador de duración
        this.scene.time.delayedCall(this.duration, () => {
            this.deactivate();
        });
    }
    
    activateEffect() {
        switch(this.type) {
            case 'freeze':
                this.activateFreezeField();
                break;
            case 'magnet':
                this.activateMagnetField();
                break;
            case 'damage':
                this.activateDamageBoost();
                break;
        }
    }
    
    activateFreezeField() {
        // Congelar ranas en el radio
        this.scene.frogGroup.getChildren().forEach(frog => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, frog.x, frog.y);
            if (distance <= this.placementRadius) {
                frog.setVelocity(0, 0);
                frog.isFrozen = true;
                frog.setTint(0x8888ff); // Tinte azul
            }
        });
    }
    
    deactivate() {
        this.isActive = false;
        this.radiusIndicator.setVisible(false);
        this.destroy();
        
        // Efecto de desaparición
        this.scene.add.particles(this.x, this.y, 'sparkle', {
            speed: 100,
            scale: { start: 0.5, end: 0 },
            lifespan: 1000,
            quantity: 10
        }).explode(10);
    }
}