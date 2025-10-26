export default class WaterPool extends Phaser.GameObjects.Zone {
    constructor(scene, x, y, width, height) {
        super(scene, x, y, width, height);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5);
        this.ranaCount = 6;
        this.radius = 40;
        this.centerX = x;
        this.centerY = y;

        // Radio de influencia (más grande que la zona visible)
        this.hideRadius = 100;
        this.hiddenFrogs = [];

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
            if (!this.hiddenFrogs.map(f => f.id).includes(frog.id) && this.hiddenFrogs.length <= this.ranaCount) {
                this.hideFrog(frog);
            }
        });

        // Mostrar ranas que se alejaron
        // this.hiddenFrogs.forEach(frog => {
        //     if (!nearbyFrogs.map(f => f.id).includes(frog.id)) {
        //         this.showFrog(frog);
        //     }
        // });
    }

    getNearbyFrogs() {
        const frogs = this.scene.plagaGroup.getChildren().filter(frog => frog.active && !frog.isHidden);
        return frogs.filter(frog => {
            const distance = Phaser.Math.Distance.Between(
                this.x, this.y, frog.x, frog.y
            );
            return distance <= this.hideRadius;
        });
    }

    hideFrog(frog) {
        const angleStep = (2 * Math.PI) / this.ranaCount;
        const angle = (this.hiddenFrogs.length) * angleStep;
        const x = this.centerX + Math.cos(angle) * this.radius;
        const y = this.centerY + Math.sin(angle) * this.radius;
        frog.hide(x, y);
        this.hiddenFrogs.push(frog);
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

        this.hiddenFrogs = this.hiddenFrogs.filter(f => f.id !== frog.id );
    }

    destroy() {
        // Mostrar todas las ranas antes de destruir el charco
        this.hiddenFrogs.forEach(frog => {
            if (!frog.active) return;
            this.showFrog(frog);
        });
        this.graphics.destroy();
        if (this.debugGraphics) this.debugGraphics.destroy();
        super.destroy();
    }

}