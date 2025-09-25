import { Scene } from 'phaser'

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.cameras.main.setBackgroundColor(0x00f94f);
        const xmedia = this.game.config.width / 2;
        const width = 468;
        this.texto = "Loading";
        this.textoFinal = this.add.text(xmedia, 300 - 36, this.texto, {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 10,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: this.textoFinal,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.puntos = "";
        this.time.addEvent({
            delay: 500,
            callback: this.actualizar,
            callbackScope: this,
            loop: true
        });


        //  We loaded this image in our Boot Scene, so we can display it here
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(xmedia, 300, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(xmedia - width / 2, 300, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);
        });
    }

    actualizar() {
        this.puntos += ".";
        if (this.puntos.length > 3) {
            this.puntos = "";
        }
        this.textoFinal.setText(this.texto + this.puntos);
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.spritesheet("rana", "rana.png", { frameWidth: 60, frameHeight: 64 });
        this.load.spritesheet("rana2", "rana2.png", { frameWidth: 70, frameHeight: 64 });
        this.load.spritesheet("player", "dude.png", { frameWidth: 32, frameHeight: 48 });
        this.load.image('tecla-1', 'tecla-1.png');
        this.load.image('tecla-2', 'tecla-2.png');
        this.load.image('tecla-3', 'tecla-3.png');
        this.load.image('particle', 'particle.png');
        this.load.image('sun-ray', 'sun-ray.png');
        this.load.image('logo', 'logo.png');
        this.load.image('bg', 'bg2.png');
        this.load.image('nube', 'nube.png');
        this.load.image('nube-2', 'nube-2.png');
        this.load.image('bosque', 'bosque.png');
        this.load.image('star', 'star.png');
        this.load.image('platform', 'platform.png');
        this.load.spritesheet('tanque', 'cisterna.png', { frameWidth: 17, frameHeight: 21 });
        this.load.spritesheet('vida', 'vida.png', { frameWidth: 32, frameHeight: 27 });
        this.load.spritesheet('mosquito', 'mosquito.png', { frameWidth: 128, frameHeight: 128 });
        this.load.audio("bosque-tenebroso", "bosque-tenebroso.wav");
        this.load.audio("efecto-1", "efecto-1.wav");
        this.load.audio("efecto-2", "efecto-2.wav");
        this.load.audio("efecto-3", "efecto-3.wav");
    }

    create() {
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}