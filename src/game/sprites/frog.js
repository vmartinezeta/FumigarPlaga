class MiSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.tweens = []; // Array para guardar los tweens activos
    }

    // Método para agregar tween de manera segura
    addTween(config) {
        config.targets = [this];
        const tween = this.scene.tweens.add(config);
        this.tweens.push(tween);
        return tween;
    }

    // Override del método destroy para limpiar tweens
    destroy() {
        this.tweens.forEach(tween => tween.remove());
        this.tweens = [];
        super.destroy();
    }
    
}