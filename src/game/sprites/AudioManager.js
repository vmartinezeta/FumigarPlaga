export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.currentMusic = null;
    }

    playBackgroundMusic(key, config = {}) {
        // Detener música anterior si existe
        if (this.currentMusic) {
            this.stopBackgroundMusic();
        }
        
        this.currentMusic = this.scene.sound.add(key, {
            volume: 0.5,
            loop: true,
            ...config
        });
        this.currentMusic.play();
        return this.currentMusic;
    }

    stopBackgroundMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    pauseBackgroundMusic() {
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.pause();
        }
    }

    resumeBackgroundMusic() {
        if (this.currentMusic && !this.currentMusic.isPlaying) {
            this.currentMusic.resume();
        }
    }

}