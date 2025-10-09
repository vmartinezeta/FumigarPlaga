import Phaser from "phaser";
import LargeAchievement from "./LargeAchievement";

export default class AchievementContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, logros) {
        super(scene);
        // scrolear para multiples logros
        logros.forEach(logro => {
            new LargeAchievement(scene, x, y, logro);
            y += 85;
        });
    }
}