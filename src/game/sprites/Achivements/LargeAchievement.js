// Achievement.js
export default class LargeAchievement extends Phaser.GameObjects.Container {
    constructor(scene, x, y, achievementData) {
        super(scene, x, y);
        this.achievementData = achievementData;
        this.createAnimation();
        scene.add.existing(this);
    }

    createAnimation() {
        // Fondo de logro
        const bg = this.scene.add.rectangle(this.x, 0, 500, 80, 0x2c3e50)
            .setStrokeStyle(2, 0xf39c12);

        // Icono
        const icon = this.scene.add.image(0, 0, 'star')
            .setScale(0.8);
        
        // Texto
        const text = this.scene.add.text(60, 0, this.achievementData.text, {
            fontSize: '16px',
            fill: '#ecf0f1',
            wordWrap: { width: 500 },
        }).setOrigin(0, 0.5);

        this.add([bg, icon, text]);
        this.setDepth(1000);
        this.setScrollFactor(0);
    }

    show() {
        // Animación de entrada
        this.scene.tweens.add({
            targets: this,
            y: 100,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Permanecer visible por 3 segundos
                this.scene.time.delayedCall(3000, () => {
                    this.hide();
                });
            }
        });
    }

    hide() {
        // Animación de salida
        this.scene.tweens.add({
            targets: this,
            y: -100,
            duration: 600,
            ease: 'Back.easeIn',
            onComplete: () => {
                this.destroy();
            }
        });
    }
}