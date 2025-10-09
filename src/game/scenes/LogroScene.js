import { EventBus } from '../EventBus'
import Phaser from 'phaser'


export class LogroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LogroScene' });
    }

    create() {
        // Fondo
        this.add.rectangle(400, 300, 1300, 600, 0x000000, 0.8).setScrollFactor(0);

        // Título
        this.add.text(400, 50, 'Logros', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Crear un contenedor para los logros
        this.container = this.add.container(400, 100);
        this.maskGraphics = this.make.graphics();
        this.maskGraphics.fillRect(100, 100, 600, 400); // Ajusta la posición y tamaño de la máscara

        const mask = new Phaser.Display.Masks.GeometryMask(this, this.maskGraphics);

        this.container.setMask(mask);

        this.logros = JSON.parse(localStorage.getItem('gameAchievements') || "[]");
        // Lista de logros (ejemplo)
        // this.logros = [
        //     { nombre: 'Primera sangre', descripcion: 'Mata tu primera rana', desbloqueado: true },
        //     { nombre: 'Cazador', descripcion: 'Mata 50 ranas', desbloqueado: false },
        //     // ... más logros
        // ];

        // Crear elementos de logro
        let y = 0;
        const spacing = 60;
        this.logros.forEach((logro, index) => {
            const bg = this.add.rectangle(0, y, 500, 50, logro.desbloqueado ? 0x00aa00 : 0x333333);
            const text = this.add.text(-240, y - 10, logro.key, { fontSize: '18px', fill: '#fff' });
            const desc = this.add.text(-240, y + 10, logro.text, { fontSize: '12px', fill: '#ccc' });

            this.container.add([bg, text, desc]);

            y += spacing;
        });

        // Hacer el contenedor arrastrable
        this.setupScroll();

        EventBus.emit('current-scene-ready', this);
    }

    setupScroll() {
        // Configurar el scroll (arrastrar)
        this.container.setInteractive(new Phaser.Geom.Rectangle(-300, -200, 600, 400), Phaser.Geom.Rectangle.Contains);
        this.input.setDraggable(this.container);

        let startY = 0;
        this.input.on('dragstart', (pointer, gameObject) => {
            startY = gameObject.y;
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            // Sólo permitir arrastrar verticalmente
            gameObject.y = dragY;

            // Limitar el scroll para que no se salga del área visible
            const minY = 100 - (this.logros.length * 60) + 400; // Ajustar según el contenido
            const maxY = 100;
            gameObject.y = Phaser.Math.Clamp(gameObject.y, minY, maxY);
        });
    }

    changeScene(key) {
        return this.scene.start(key);
    }
}