import Phaser from "phaser"

export default class BorderSolido extends Phaser.GameObjects.Graphics {
    constructor(scene, config = {}) {
        super(scene)
        this.scene = scene
        this.originX = config.x || 0
        this.originY = config.y || 0
        this.width = config.width || scene.scale.width
        this.height = config.height || scene.scale.height
        this.lineWidth = config.lineWidth || 2
        this.color = config.color !== undefined ? config.color : 0xffffff
        this.alpha = config.alpha !== undefined ? config.alpha : 1
        this.drawBorders()

        scene.physics.add.existing(this)
        this.body.allowGravity = false
    }

    drawBorders() {
        // Limpiar gráficos previos
        this.clear()
        
        // Establecer estilo de línea
        this.lineStyle(this.lineWidth, this.color, this.alpha);
        
        // Convertir coordenadas cartesianas a coordenadas de pantalla de Phaser
        // const screenOriginX = this.width / 2 + this.originX;
        // const screenOriginY = this.height / 2 - this.originY;
        
        // Dibujar los bordes del área visible
        // const left = -this.originX;
        // const right = this.width - this.originX;
        // const top = this.originY;
        // const bottom = this.originY - this.height;
        

        // Dibujar rectángulo (bordes)
        this.strokeRect(
            this.originX,
            this.originY,
            this.width,
            this.height
        );
        
        // // Opcional: dibujar ejes X e Y
        // this.lineStyle(1, 0xff0000, 0.5);
        // // Eje X
        // this.beginPath();
        // this.moveTo(left, screenOriginY);
        // this.lineTo(right, screenOriginY);
        // this.strokePath();
        // // Eje Y
        // this.beginPath();
        // this.moveTo(screenOriginX, top);
        // this.lineTo(screenOriginX, bottom);
        // this.strokePath();
    }
    
    // Métodos para actualizar propiedades
    setOrigin(x, y) {
        this.originX = x;
        this.originY = y;
        this.drawBorders();
        return this;
    }
    
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.drawBorders();
        return this;
    }
    
    setLineStyle(lineWidth, color, alpha) {
        this.lineWidth = lineWidth;
        this.color = color;
        this.alpha = alpha;
        this.drawBorders();
        return this;
    }
}