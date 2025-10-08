export default class UIManager {
    constructor(scene, eventBus, statusBar) {
        this.scene = scene;
        this.eventBus = eventBus;
        this.statusBar = statusBar;
        this.gameOver = false;
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

    setupEventListeners() {
        // Salud del jugador
        this.eventBus.on('playerHealthChanged', this.updateHealthBar, this);
        this.eventBus.on('puntuacionChanged', this.updatePuntuacion, this);
        this.eventBus.on('playerKilled', this.morirPlayer, this);
        // this.eventBus.on('playerMaxHealthChanged', this.updateMaxHealth, this);

        // this.eventBus.on('ranaKilled', this.morirRana, this);

        // Sistema de furia
        this.eventBus.on('furiaActivated', this.showFuriaEffect, this);
        this.eventBus.on('furiaDeactivated', this.hideFuriaEffect, this);
    }

    setStatusBar(statusBar) {
        this.statusBar = statusBar;
    }

    morirPlayer({ player }) {
        player.takeDamage();
        this.eventBus.emit("playerHealthChanged", { vida:+player.vida });
        if (player.debeMorir()) {
            player.destroy();
            this.gameOver = true;
        }
    }    

    updateHealthBar({ vida }) {
        this.statusBar.actualizar(vida, 0);
    }

    updatePuntuacion({ puntuacion }) {
        this.statusBar.setPuntuacion(puntuacion);
    }

    showFuriaEffect({ player, potenciador }) {
        player.activarFuria();
        this.emitter.start();
        this.emitter.startFollow(player);
        this.scene.tweens.add({
            targets: player,
            scaleX: { from: .6, to: 1 },
            scaleY: { from: .6, to: 1 },
            duration: 1000,
            ease: 'Back.out',
        });

        this.potenciadorGroup.remove(potenciador, true, true);

        this.scene.time.delayedCall(10000, () => {
            this.eventBus.emit('furiaDeactivated', { player });
        });
    }

    hideFuriaEffect({ player }) {
        this.emitter.stop();
        player.reset();
    }
}