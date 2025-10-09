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
        this.eventBus.on('playerDead', this.morirPlayer, this);

        // Sistema de furia
        this.eventBus.on('furiaActivated', this.showFuriaEffect, this);
    }

    setStatusBar(statusBar) {
        this.statusBar = statusBar;
    }

    morirPlayer({ player }) {
        player.takeDamage();
        this.eventBus.emit("playerHealthChanged", { vida:player.vida });
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
        potenciador.applyEffect(player);
        this.emitter.start();
        this.emitter.startFollow(player);
        this.scene.tweens.add({
            targets: player,
            scaleX: { from: .6, to: 1 },
            scaleY: { from: .6, to: 1 },
            duration: 1000,
            ease: 'Back.out',
        });

        this.scene.time.removeEvent(potenciador.timer);
        potenciador.destroy();

        this.scene.time.delayedCall(potenciador.timegame, () => {
            this.emitter.stop();
        });
    }
}