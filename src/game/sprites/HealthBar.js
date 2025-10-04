// HEALTHBAR.JS - Componente independiente
import Phaser  from "phaser";

export default class HealthBar extends Phaser.GameObjects.Graphics{
    constructor(scene, entity, config) {
        super(scene, config);
        this.scene = scene;
        this.entity = entity;

        // Suscribirse a eventos de la entidad
        this.entity.on('healthChanged', this.update, this);
        this.entity.on('died', this.hide, this);

        // Crear gráficos de la barra de salud...
    }

    update(data) {
        const percent = data.currentHealth / data.maxHealth;
        // Actualizar gráficos de la barra
        this.bar.clear();
        this.bar.fillStyle(0x00ff00, 1);
        this.bar.fillRect(0, 0, 50 * percent, 5);
    }

    hide() {
        this.bar.setVisible(false);
    }
}