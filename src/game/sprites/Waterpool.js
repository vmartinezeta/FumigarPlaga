export default class WaterPool extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setOrigin(0.5);
        
        // Radio de influencia (más grande que la zona visible)
        this.hideRadius = 100;
        this.hiddenFrogs = new Set();
        
        // Configuración visual del charco
        this.createVisual();
    }
    
    createVisual() {
        // Crear gráficos para el charco
        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(0x006994, 0.6);
        this.graphics.fillEllipse(this.x, this.y, this.width, this.height);
        this.graphics.lineStyle(2, 0x00FFFF, 0.8);
        this.graphics.strokeEllipse(this.x, this.y, this.width, this.height);
        
        // Área de influencia (debug, opcional)
        if (this.scene.debugMode) {
            this.debugGraphics = this.scene.add.graphics();
            this.debugGraphics.lineStyle(1, 0xFF0000, 0.3);
            this.debugGraphics.strokeCircle(this.x, this.y, this.hideRadius);
        }
    }
    
    update() {
        // Verificar ranas cercanas
        const nearbyFrogs = this.getNearbyFrogs();
        
        // Ocultar ranas que están en el radio
        nearbyFrogs.forEach(frog => {
            if (!this.hiddenFrogs.has(frog)) {
                this.hideFrog(frog);
            }
        });
        
        // Mostrar ranas que se alejaron
        this.hiddenFrogs.forEach(frog => {
            if (!nearbyFrogs.includes(frog) || !frog.active) {
                this.showFrog(frog);
            }
        });
    }
    
    getNearbyFrogs() {
        const frogs = this.scene.frogManager.frogs;
        return frogs.filter(frog => {
            const distance = Phaser.Math.Distance.Between(
                this.x, this.y, frog.x, frog.y
            );
            return distance <= this.hideRadius && frog.active;
        });
    }
    
    hideFrog(frog) {
        frog.isHidden = true;
        frog.previousTexture = frog.texture.key;
        frog.setTexture('frog-hidden'); // Sprite solo con ojos
        frog.setAlpha(0.7); // Semi-transparente
        
        // Reducir velocidad cuando está escondida
        if (frog.body) {
            frog.previousSpeed = frog.body.speed;
            frog.body.setVelocity(0, 0);
        }
        
        this.hiddenFrogs.add(frog);
    }
    
    showFrog(frog) {
        frog.isHidden = false;
        frog.setTexture(frog.previousTexture);
        frog.setAlpha(1);
        
        // Restaurar velocidad
        if (frog.body && frog.previousSpeed) {
            const angle = Phaser.Math.Between(0, 360);
            this.scene.physics.velocityFromRotation(
                angle, frog.previousSpeed, frog.body.velocity
            );
        }
        
        this.hiddenFrogs.delete(frog);
    }
    
    destroy() {
        // Mostrar todas las ranas antes de destruir el charco
        this.hiddenFrogs.forEach(frog => this.showFrog(frog));
        this.graphics.destroy();
        if (this.debugGraphics) this.debugGraphics.destroy();
        super.destroy();
    }
}