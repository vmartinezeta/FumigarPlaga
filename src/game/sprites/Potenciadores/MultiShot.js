import PowerUp from "./PowerUp";


export default class MultiShoot extends PowerUp {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey, "weapon");
        this.color = 0xffff00;
        this.fierros = [
            'honda',
            'superHonda',
            'bomba',
            'lanzaLlamas',
            'lanzaHumo'
        ];
        const type = Math.floor(Math.random()*this.fierros.length);
        this.hondaType = this.fierros[type];
        this.flotar();
        this.play("nuevo-fierro");

        this.text = scene.add.text(x, y, this.hondaType, {
            fontSize: '16px',
            fill: '#ecf0f1'
        }).setOrigin(0.5);

    }

    animate() {
        if (!this.existe("nuevo-fierro")) {
            this.scene.anims.create({
                key: 'nuevo-fierro',
                frames: this.scene.anims.generateFrameNumbers(this.imageKey, { start: 0, end: 2 }),
                frameRate: 12,
                repeat: -1
            });
        }
    }
}