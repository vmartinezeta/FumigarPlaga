import PowerUp from "./PowerUp";

export default class FreezeFrog extends PowerUp {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        this.placementRadius = 100; // Radio de efecto
    }

    activateFreezeField() {
        // Congelar ranas en el radio
        this.scene.plagaGroup.getChildren().forEach(frog => {
            const distance = Phaser.Math.Distance.Between(this.x, this.y, frog.x, frog.y);
            if (distance <= this.placementRadius) {
                frog.setVelocity(0, 0);
                frog.isFrozen = true;
                frog.setTint(0x8888ff); // Tinte azul
            }
        });
    }

}