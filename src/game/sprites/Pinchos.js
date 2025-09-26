import Phaser from "phaser";

export default class Pinchos extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        scene.physics.add.existing(this);
        for (let i = 0; i<5; i++) {
            const x = Math.random()*scene.width;
            const y = scene.height - Math.random()*scene.height/2;
            this.createPincho(x, y);
        }
    }


    createPincho(x, y) {
        this.createSprite(x, y, "pinchos");
        this.createSprite(x+10, y, "pinchos");
        this.createSprite(x-20, y, "pinchos");
        this.createSprite(x-10, y, "pinchos");
        this.createSprite(x-30, y, "pinchos");
    }

    createSprite(x, y, imageKey) {
        return this.create(x, y, imageKey).setScale(1/3);
    }

}