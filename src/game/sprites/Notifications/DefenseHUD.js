class DefenseHUD {
    constructor(scene) {
        this.scene = scene;
        this.icons = new Map();
        this.setupHUD();
    }

    setupHUD() {
        const startX = 50;
        const startY = this.scene.game.config.height - 50;
        
        const weapons = [
            { key: 'escudo', color: 0x00FFFF, x: startX, y: startY },
            { key: 'latigo', color: 0xFFA500, x: startX + 60, y: startY },
            { key: 'cuchillo', color: 0xFF0000, x: startX + 120, y: startY }
        ];
        
        weapons.forEach(weapon => {
            const icon = this.scene.add.circle(
                weapon.x, weapon.y, 15, weapon.color, 0.3
            );
            icon.setStrokeStyle(2, weapon.color);
            
            const keyText = this.scene.add.text(
                weapon.x, weapon.y, 
                weapon.key.charAt(0).toUpperCase(), 
                { fontSize: '12px', fill: '#FFFFFF' }
            ).setOrigin(0.5);
            
            this.icons.set(weapon.key, { icon, text: keyText, active: false });
        });
    }

    updateDefensiveWeapon(weaponKey, isActive) {
        const hudElement = this.icons.get(weaponKey);
        if (hudElement) {
            hudElement.active = isActive;
            hudElement.icon.fillAlpha = isActive ? 0.8 : 0.3;
            hudElement.icon.setStrokeStyle(2, isActive ? 0xFFFFFF : hudElement.icon.strokeColor);
        }
    }
}