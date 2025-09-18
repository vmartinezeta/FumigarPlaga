import { Scene } from 'phaser'

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.spritesheet("rana", "rana.png", {frameWidth:60, frameHeight:64});
        this.load.spritesheet("rana2", "rana2.png", {frameWidth:70, frameHeight:64});
        this.load.spritesheet("player", "dude.png", {frameWidth:32, frameHeight:48});
        this.load.image('tecla-1', 'tecla-1.png');
        this.load.image('tecla-2', 'tecla-2.png');
        this.load.image('tecla-3', 'tecla-3.png');
        this.load.image('particle', 'particle.png');
        this.load.image('logo', 'logo.png');
        this.load.image('bg', 'bg2.png');
        this.load.image('nube', 'nube.png');
        this.load.image('nube-2', 'nube-2.png');
        this.load.image('bosque', 'bosque.png');
        this.load.image('star', 'star.png');
        this.load.image('platform', 'platform.png');
        this.load.spritesheet('tanque', 'cisterna.png', {frameWidth:17, frameHeight:21});
        this.load.spritesheet('vida', 'vida.png', {frameWidth:32, frameHeight:27});
    }

    create ()
    {
        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
