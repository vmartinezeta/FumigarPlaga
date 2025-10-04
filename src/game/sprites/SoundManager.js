// SOUNDMANAGER.JS
export default class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Suscribirse a eventos globales del juego
        this.scene.events.on('enemyHit', this.playEnemyHit, this);
        this.scene.events.on('playerHit', this.playPlayerHit, this);
        this.scene.events.on('powerupCollected', this.playPowerupSound, this);
    }
    
    playEnemyHit() {
        this.scene.sound.play('hit', { volume: 0.5 });
    }
}