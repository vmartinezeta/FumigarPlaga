class DifficultyManager {
    constructor(scene) {
        this.scene = scene;
        this.gameTime = 0;
        this.difficultyLevel = 1;
        this.maxDifficulty = 10;

        // Configuración de progresión
        this.difficultyConfig = {
            baseSpawnRate: 0.3,       // Probabilidad base de spawn
            decayRate: 0.05,          // Reducción por nivel de dificultad
            timePerLevel: 60000,      // 1 minuto por nivel (60 segundos)
            minSpawnRate: 0.05        // Mínima probabilidad
        };

        this.startTimeTracking();
    }

    startTimeTracking() {
        this.scene.time.addEvent({
            delay: 1000, // Actualizar cada segundo
            callback: this.updateDifficulty,
            callbackScope: this,
            loop: true
        });
    }

    updateDifficulty() {
        this.gameTime += 1000;
        this.difficultyLevel = Math.min(
            this.maxDifficulty,
            1 + Math.floor(this.gameTime / this.difficultyConfig.timePerLevel)
        );

        // Emitir evento de dificultad cambiada
        this.scene.eventBus.emit('difficultyChanged', {
            level: this.difficultyLevel,
            gameTime: this.gameTime
        });
    }

    getPowerupSpawnChance(powerupType) {
        const baseChance = this.difficultyConfig.baseSpawnRate;
        const decay = this.difficultyConfig.decayRate * (this.difficultyLevel - 1);

        let chance = baseChance - decay;

        // Ajustar por tipo de potenciador
        switch (powerupType) {
            case 'express':
                chance *= 0.7; // Los express son más comunes
                break;
            case 'group':
                chance *= 0.4; // Los de grupo son más raros
                break;
            case 'rare':
                chance *= 0.1; // Potenciadores raros
                break;
        }

        return Math.max(this.difficultyConfig.minSpawnRate, chance);
    }

    getCurrentDifficulty() {
        return {
            level: this.difficultyLevel,
            gameTime: this.gameTime,
            spawnRates: {
                express: this.getPowerupSpawnChance('express'),
                group: this.getPowerupSpawnChance('group'),
                rare: this.getPowerupSpawnChance('rare')
            }
        };
    }

    getFamilySpawnConfig() {
        const baseConfig = {
            static: {
                minRanas: 5,
                maxRanas: 8,
                radius: 80,
                healthMultiplier: 1.0
            },
            movable: {
                minRanas: 5,
                maxRanas: 7,
                radius: 90,
                movementRadius: 120,
                healthMultiplier: 1.0,
                speedMultiplier: 1.0
            }
        };

        // Aumentar dificultad según nivel
        const difficultyMultiplier = 1 + (this.difficultyLevel * 0.1);

        return {
            static: {
                minRanas: baseConfig.static.minRanas,
                maxRanas: Math.min(12, baseConfig.static.maxRanas + Math.floor(this.difficultyLevel * 0.5)),
                radius: baseConfig.static.radius,
                healthMultiplier: baseConfig.static.healthMultiplier * difficultyMultiplier
            },
            movable: {
                minRanas: baseConfig.movable.minRanas,
                maxRanas: Math.min(10, baseConfig.movable.maxRanas + Math.floor(this.difficultyLevel * 0.3)),
                radius: baseConfig.movable.radius,
                movementRadius: baseConfig.movable.movementRadius,
                healthMultiplier: baseConfig.movable.healthMultiplier * difficultyMultiplier,
                speedMultiplier: baseConfig.movable.speedMultiplier * (1 + (this.difficultyLevel * 0.05))
            }
        };
    }
}