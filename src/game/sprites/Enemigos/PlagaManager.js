import Phaser from "phaser";

export default class PlagaManager {
    constructor(scene, plagaGroup) {
        this.scene = scene;
        this.plagaGroup = plagaGroup;
        this.gameTime = 0; // Tiempo de juego en segundos
        this.maxFrogs = 50; // Límite absoluto de ranas
        this.baseThreshold = 50; // Umbral base de distancia para apareamiento
        this.timeThreshold = 0; // Incremento del umbral con el tiempo
        this.breedingCooldown = 5000; // Tiempo en ms entre apareamientos por rana
        this.lastBreedTime = {}; // Diccionario para guardar el último tiempo de apareamiento de cada rana        
        this.totalRanas = 600;
    }

    update(delta) {
        this.gameTime += delta / 1000; // Convertir delta a segundos
        // Calcular el umbral actual: baseThreshold + (incremento por tiempo)
        // Por ejemplo, cada 10 segundos el umbral aumenta 1 pixel, hasta un máximo de 100.
        this.timeThreshold = Math.min(50, Math.floor(this.gameTime / 10));
        let currentThreshold = this.baseThreshold + this.timeThreshold;

        // Lógica de apareamiento
        this.breedFrogs(currentThreshold);
    }

    breedFrogs(threshold) {
        let frogsArray = this.plagaGroup.getChildren();
        let currentTime = this.gameTime * 1000; // Convertir a ms

        for (let i = 0; i < frogsArray.length; i++) {
            let frog1 = frogsArray[i];
            for (let j = i + 1; j < frogsArray.length; j++) {
                let frog2 = frogsArray[j];

                // Calcular distancia entre frog1 y frog2
                let distance = Phaser.Math.Distance.Between(frog1.x, frog1.y, frog2.x, frog2.y);
                if (distance < threshold) {
                    // Verificar cooldown para frog1 y frog2
                    if (this.canBreed(frog1, currentTime) && this.canBreed(frog2, currentTime)) {
                        this.createNewFrog(frog1, frog2);
                        this.lastBreedTime[frog1.id] = currentTime;
                        this.lastBreedTime[frog2.id] = currentTime;
                        break; // Evitar múltiples apareamientos para la misma rana en un mismo frame
                    }
                }
            }
        }
    }

    canBreed(frog, currentTime) {
        // Si no ha criado antes, puede criar. O si ha pasado el cooldown.
        if (!this.lastBreedTime[frog.id]) {
            return true;
        }
        return (currentTime - this.lastBreedTime[frog.id]) > this.breedingCooldown;
    }

    createNewFrog(frog1, frog2) {
        if (this.plagaGroup.countActive() > this.totalRanas) return;
        frog1.cogiendo(frog2, "rana-cogiendo", this.dejarCoger, this);
    }

    dejarCoger() {
        this.plagaGroup.agregar(this.scene, 1);
    }

}