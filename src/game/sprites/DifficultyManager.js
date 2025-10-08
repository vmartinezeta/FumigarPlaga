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
        switch(powerupType) {
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
}