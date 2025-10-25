class PowerUpManager {
    // ... código anterior ...

    setupPowerUpTypes() {
        this.powerUpTypes = {
            // ... otros potenciadores ...
            
            mosquito_bait: {
                key: 'mosquito_bait',
                name: 'Cebo de Mosquitos',
                effect: (player) => this.activateMosquitoBait(player),
                type: 'strategic',
                duration: 8000
            }
        };
    }

    activateMosquitoBait(player) {
        // Posicionar el cebo cerca del jugador pero no encima
        const angle = Phaser.Math.Between(0, 360);
        const distance = 100;
        const baitX = player.x + Math.cos(Phaser.Math.DegToRad(angle)) * distance;
        const baitY = player.y + Math.sin(Phaser.Math.DegToRad(angle)) * distance;
        
        this.mosquitoBait.activate(baitX, baitY);
        
        // Feedback al jugador
        this.showBaitActivationFeedback(baitX, baitY);
    }

    showBaitActivationFeedback(x, y) {
        const text = this.scene.add.text(x, y - 50, '¡CEBO ACTIVADO!', {
            fontSize: '16px',
            fill: '#FFD700',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 80,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    update(time, delta) {
        // ... código anterior ...
        
        // Actualizar cebo de mosquitos si está activo
        if (this.mosquitoBait.isActive) {
            this.mosquitoBait.update();
        }
    }
}