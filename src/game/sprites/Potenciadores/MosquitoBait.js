class MosquitoBaitPowerUp {
    constructor(scene) {
        this.scene = scene;
        this.isActive = false;
        this.baitGroup = null;
        this.mosquitoGroup = null;
        this.attractionRadius = 150;
        this.baitDuration = 8000; // 8 segundos
        this.currentBait = null;
    }

    activate(x, y) {
        if (this.isActive) return;

        this.isActive = true;
        this.createBaitEffect(x, y);
        this.spawnMosquitos(x, y);
        
        // Iniciar temporizador
        this.scene.time.delayedCall(this.baitDuration, () => {
            this.deactivate();
        });
    }

    createBaitEffect(x, y) {
        // Crear el punto de cebo visual
        this.currentBait = this.scene.add.sprite(x, y, 'bait-texture');
        this.currentBait.setScale(0.8);
        
        // Efecto de partículas atractivo
        this.baitParticles = this.scene.add.particles('flare');
        this.baitEmitter = this.baitParticles.createEmitter({
            x: x,
            y: y,
            speed: { min: 20, max: 40 },
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            frequency: 100
        });

        // Zona de atracción visual (debug opcional)
        this.attractionZone = this.scene.add.circle(x, y, this.attractionRadius, 0xFF6B6B, 0.2);
        this.attractionZone.setVisible(false); // Ocultar en producción
    }

    spawnMosquitos(x, y) {
        this.mosquitoGroup = this.scene.physics.add.group();
        
        const mosquitoCount = Phaser.Math.Between(8, 15);
        
        for (let i = 0; i < mosquitoCount; i++) {
            // Posicionar mosquitos alrededor del cebo
            const angle = (i / mosquitoCount) * Math.PI * 2;
            const distance = Phaser.Math.Between(20, 60);
            const mosquitoX = x + Math.cos(angle) * distance;
            const mosquitoY = y + Math.sin(angle) * distance;
            
            const mosquito = this.mosquitoGroup.create(mosquitoX, mosquitoY, 'mosquito');
            mosquito.setScale(0.6);
            
            // Movimiento de vuelo errático alrededor del cebo
            this.setupMosquitoMovement(mosquito, x, y);
        }
    }

    setupMosquitoMovement(mosquito, baitX, baitY) {
        // Vuelo circular con variación aleatoria
        this.scene.tweens.add({
            targets: mosquito,
            x: baitX + Phaser.Math.Between(-40, 40),
            y: baitY + Phaser.Math.Between(-40, 40),
            duration: Phaser.Math.Between(800, 1500),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Animación de aleteo
        this.scene.tweens.add({
            targets: mosquito,
            angle: 360,
            duration: 300,
            repeat: -1
        });
    }

    update() {
        if (!this.isActive || !this.currentBait) return;

        // Atraer ranas hacia el cebo
        this.attractFrogs();
        
        // Actualizar mosquitos
        this.updateMosquitos();
    }

    attractFrogs() {
        const frogs = this.scene.frogManager.frogs;
        
        frogs.forEach(frog => {
            if (!frog.active) return;
            
            const distance = Phaser.Math.Distance.Between(
                this.currentBait.x, this.currentBait.y,
                frog.x, frog.y
            );
            
            // Si la rana está en el radio de atracción
            if (distance < this.attractionRadius) {
                this.attractFrogToBait(frog);
            }
        });
    }

    attractFrogToBait(frog) {
        // Marcar rana como atraída
        frog.isAttracted = true;
        frog.baitTarget = this.currentBait;
        
        // Mover rana hacia el cebo
        const angle = Phaser.Math.Angle.Between(
            frog.x, frog.y,
            this.currentBait.x, this.currentBait.y
        );
        
        // Velocidad basada en la distancia (más rápida cuando está lejos)
        const speed = Phaser.Math.Clamp(this.attractionRadius / 50, 50, 120);
        
        this.scene.physics.velocityFromRotation(angle, speed, frog.body.velocity);
        
        // Efecto visual: cambiar color cuando está atraída
        frog.setTint(0xFFFF00);
    }

    updateMosquitos() {
        if (!this.mosquitoGroup) return;

        // Mosquitos ocasionalmente se mueven más lejos y regresan
        this.mosquitoGroup.getChildren().forEach(mosquito => {
            if (Phaser.Math.Between(0, 100) < 2) { // 2% de probabilidad por frame
                this.scene.tweens.killTweensOf(mosquito);
                this.setupMosquitoMovement(mosquito, this.currentBait.x, this.currentBait.y);
            }
        });
    }

    deactivate() {
        this.isActive = false;
        
        // Limpiar efectos visuales
        if (this.currentBait) {
            this.currentBait.destroy();
            this.currentBait = null;
        }
        
        if (this.baitParticles) {
            this.baitParticles.destroy();
        }
        
        if (this.attractionZone) {
            this.attractionZone.destroy();
        }
        
        // Liberar mosquitos (volar lejos)
        this.releaseMosquitos();
        
        // Liberar ranas
        this.releaseFrogs();
    }

    releaseMosquitos() {
        if (!this.mosquitoGroup) return;

        this.mosquitoGroup.getChildren().forEach(mosquito => {
            // Volar en dirección aleatoria lejos
            const angle = Phaser.Math.Between(0, 360);
            this.scene.physics.velocityFromRotation(
                Phaser.Math.DegToRad(angle), 
                80, 
                mosquito.body.velocity
            );
            
            // Destruir después de un tiempo
            this.scene.time.delayedCall(2000, () => {
                if (mosquito.active) mosquito.destroy();
            });
        });
        
        this.mosquitoGroup = null;
    }

    releaseFrogs() {
        const frogs = this.scene.frogManager.frogs;
        
        frogs.forEach(frog => {
            if (frog.isAttracted) {
                frog.isAttracted = false;
                frog.baitTarget = null;
                frog.clearTint();
                
                // Volver a comportamiento normal después de un breve momento
                this.scene.time.delayedCall(1000, () => {
                    if (frog.active) {
                        this.scene.frogManager.setRandomMovement(frog);
                    }
                });
            }
        });
    }
}