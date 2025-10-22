class PowerUpManager {
    constructor(scene) {
        this.scene = scene;
        this.powerUps = [];
        this.directSpawnChance = 0.3; // Probabilidad inicial de aparición directa
        this.familySpawnChance = 0.7; // Probabilidad de que una familia tenga un potenciador
        this.maxPowerUps = 4;
        this.spawnCooldown = 5000;
        this.lastSpawnTime = 0;
        this.gameTime = 0;
        this.transitionTime = 60000; // Después de 60 segundos, cambia a modo familias
        this.powerUpTypes = ['speed', 'freeze', 'multishot', 'newWeapon'];
    }

    update(time) {
        this.gameTime = time;
    }

    trySpawnPowerUp(x, y, time) {
        // Si estamos en fase temprana, aparecen directamente
        if (this.gameTime < this.transitionTime) {
            if (this.powerUps.length >= this.maxPowerUps) return false;
            if (time - this.lastSpawnTime < this.spawnCooldown) return false;
            if (Math.random() > this.directSpawnChance) return false;

            this.spawnDirectPowerUp(x, y);
            this.lastSpawnTime = time;
            return true;
        }
        // En fase tardía, no aparecen directamente, sino por familias
        return false;
    }

    spawnDirectPowerUp(x, y) {
        const type = this.choosePowerUpType();
        this.createPowerUp(x, y, type);
    }

    // Método para generar un potenciador en una familia
    spawnFamilyPowerUp(family) {
        if (Math.random() < this.familySpawnChance) {
            const type = this.choosePowerUpType();
            family.hasPowerUp = true;
            family.powerUpType = type;
        }
    }

    createPowerUp(x, y, type) {
        const powerUp = this.scene.physics.add.sprite(x, y, `powerup-${type}`);
        powerUp.powerUpType = type; // Guardamos el tipo para luego
        this.powerUps.push(powerUp);

        // Efecto flotante
        this.scene.tweens.add({
            targets: powerUp,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    choosePowerUpType() {
        // Lógica para elegir el tipo de potenciador
        // Puede ser aleatorio o ponderado
        return this.powerUpTypes[Math.floor(Math.random() * this.powerUpTypes.length)];
    }

    // Cuando el jugador recoge un potenciador
    collectPowerUp(player, powerUp) {
        // Aplicar el efecto según el tipo
        this.applyPowerUp(player, powerUp.powerUpType);

        // Eliminar el potenciador de la escena y de la lista
        powerUp.destroy();
        this.powerUps = this.powerUps.filter(p => p !== powerUp);
    }

    applyPowerUp(player, type) {
        switch (type) {
            case 'speed':
                // Aumentar velocidad del jugador
                break;
            case 'freeze':
                // Congelar ranas por un tiempo
                break;
            case 'multishot':
                // Cambiar a disparo múltiple
                break;
            case 'newWeapon':
                // Ofrecer nueva arma
                this.offerNewWeapon(player);
                break;
        }
    }

    offerNewWeapon(player) {
        // Mostrar un diálogo o interfaz para que el jugador decida
        // Por ahora, lo hacemos con un console.log y una elección aleatoria del jugador
        // En un juego real, sería una interfaz gráfica
        const newWeapon = 'armaNueva'; // Esto sería un tipo de arma nueva
        const accept = confirm('¿Quieres cambiar tu arma por ' + newWeapon + '?');
        if (accept) {
            player.changeWeapon(newWeapon);
        }
    }

}