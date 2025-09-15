import Phaser from "phaser";

export default class DockCentro extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        const xmedia = scene.game.config.width / 2;
        const ymedia = scene.game.config.height / 2;
        const margen = 50;
        this.grafico = null;
        this.izq = this.create(xmedia - margen, ymedia, "tecla-1");
        this.izq.setOrigin(1 / 2);
        this.izq.setTint(0x00ff00);
        this.izq.setDepth(10);
        this.add(this.izq);
        this.der = this.create(xmedia + margen, ymedia, "tecla-2");
        this.der.setOrigin(1 / 2);
        this.der.setDepth(10);
        this.add(this.der);
        this.setVisible(false);
    }

    updateDock(ajuste) {
        this.setVisible(true);
        const xmedia = this.scene.game.config.width / 2;
        const ymedia = this.scene.game.config.height / 2;
        this.drawHitArea(xmedia-100, ymedia-50, this.createPoints(200, 100));
        this.scene.time.delayedCall(600, this.ocultar, [], this);
        if (ajuste === 1) {
            this.izq.setTint(0x00ff00);
            this.der.setTint(0xffffff);
        } else if (ajuste === 2) {
            this.izq.setTint(0xffffff);
            this.der.setTint(0x00ff00);
        }
    }

    ocultar() {
        this.setVisible(false);
        this.remove(this.grafico,true,true);
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
        this.add(this.grafico);
    }

}