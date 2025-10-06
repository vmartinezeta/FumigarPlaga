import Phaser from "phaser";
import Icono from "./Icono";

export default class DockCentro extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        const xmedia = scene.game.config.width / 2;
        const ymedia = scene.game.config.height / 2;
        const margen = 100;
        this.iconos = []
        this.grafico = null;
        const t1 = new Icono(scene, xmedia - margen, ymedia, 1, "tecla-1", false);
        this.iconos.push(t1);
        this.add(t1);

        const t2 = new Icono(scene, xmedia, ymedia, 2, "tecla-2", false)
        this.iconos.push(t2);
        this.add(t2);

        const t3 = new Icono(scene, xmedia + margen, ymedia, 3, "tecla-3", false);
        this.iconos.push(t3);
        this.add(t3);
    }

    updateDock(ajuste) {
        this.setVisible(true);
        this.setDepth(20);
        const xmedia = (this.scene.game.config.width / 2)-150;
        const ymedia = this.scene.game.config.height / 2;
        this.drawHitArea(xmedia, ymedia - 50, this.createPoints(300, 100));
        this.scene.time.delayedCall(600, this.ocultar, [], this);
        this.iconos.map(icono => icono.setTint(0xffffff));

        const icono = this.iconos.find(icono => icono.id === ajuste);
        if (icono) {
            icono.setTint(0x00ff00);
        }
    }


    ocultar() {
        this.setVisible(false);
        this.remove(this.grafico, true, true);
    }

    createPoints(width, height) {
        const points = [];
        points.push(new Phaser.Geom.Point(0, 0));
        points.push(new Phaser.Geom.Point(width, 0));
        points.push(new Phaser.Geom.Point(width, height));
        points.push(new Phaser.Geom.Point(0, height));
        return new Phaser.Geom.Polygon(points);
    }

    drawHitArea(x, y, hitArea) {
        this.grafico = this.scene.add.graphics();
        this.grafico.lineStyle(2, 0xffffff);
        this.grafico.fillStyle(0x000000, 1);
        this.grafico.strokePoints(hitArea.points, true);
        this.grafico.fillPoints(hitArea.points, true);
        this.grafico.setPosition(x, y);
        this.grafico.setDepth(1);
        this.grafico.setScrollFactor(0);
        this.add(this.grafico);
    }

}