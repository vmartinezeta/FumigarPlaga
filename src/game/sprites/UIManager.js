// UIMANAGER.JS - Maneja diferentes elementos de UI
export default class UIManager {
    constructor(scene, eventBus, potenciadores) {
        this.scene = scene;
        this.eventBus = eventBus;
        this.potenciadores = potenciadores;
        this.barraEstado = null;
        this.emitter = scene.add.particles(0, 0, 'particle', {
            speed: 100,
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 1000,
            quantity: 2,
            emitting: false
        });

        // Suscribirse a múltiples eventos
        this.setupEventListeners();
        // this.createUIElements();
    }

    setBarraEstado(barra) {
        this.barraEstado = barra;
    }

    setupEventListeners() {
        // Salud del jugador
        // this.eventBus.on('playerHealthChanged', this.updateHealthBar, this);
        // this.eventBus.on('playerMaxHealthChanged', this.updateMaxHealth, this);

        // Armas y power-ups
        // this.eventBus.on('weaponChanged', this.updateWeaponDisplay, this);
        // this.eventBus.on('powerupCollected', this.showPowerupMessage, this);

        // Sistema de furia
        this.eventBus.on('furiaActivated', this.showFuriaEffect, this);
        this.eventBus.on('furiaDeactivated', this.hideFuriaEffect, this);


        // Enemigos
        // this.eventBus.on('enemySpawned', this.updateEnemyCounter, this);
        // this.eventBus.on('enemyKilled', this.updateEnemyCounter, this);
    }

    showFuriaEffect({ player, potenciador }) {
        player.activarFuria();
        this.emitter.start();
        this.emitter.startFollow(player);
        this.updateUI(player, potenciador);
        this.scene.time.delayedCall(10000, () => {
            this.eventBus.emit('furiaDeactivated', { player });
        });
    }

    hideFuriaEffect({ player }) {
        this.emitter.stop();
        player.reset();
    }

    updateHealthBar(data) {
        const percent = data.currentHealth / data.maxHealth;
        this.healthBar.clear();
        this.healthBar.fillStyle(this.getHealthColor(percent), 1);
        this.healthBar.fillRect(10, 10, 200 * percent, 20);

        // También actualizar texto si existe
        if (this.healthText) {
            this.healthText.setText(`Salud: ${data.currentHealth}/${data.maxHealth}`);
        }
    }

    updateWeaponDisplay(data) {
        this.weaponIcon.setTexture(data.weapon.icon);
        this.weaponText.setText(data.weapon.name);

        // Animación de cambio de arma
        this.scene.tweens.add({
            targets: this.weaponIcon,
            scaleX: 1.5,
            scaleY: 1.5,
            yoyo: true,
            duration: 200
        });
    }

    updateUI(player, potenciador) {
        this.scene.tweens.add({
            targets: player,
            scaleX: { from: .6, to: 1 },
            scaleY: { from: .6, to: 1 },
            duration: 1000,
            ease: 'Back.out',
        });
        this.barraEstado.actualizar(player.vida, 0);
        this.potenciadores.remove(potenciador, true, true);
    }
}