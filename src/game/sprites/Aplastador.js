import Phaser from "phaser"
import Plaga from "./Plaga";
import { Punto } from "../classes/Punto";
import { Letra } from "../classes/Letra";

export default class Aplastador extends Phaser.GameObjects.Group {
    constructor(scene, children, config) {
        // Llamar al constructor de la clase padre (Phaser.GameObjects.Group)
        super(scene, children, config)
        this.total = 0
        this.texto = "FUMIGAR"
        this.letra = null        
        // Inicializar propiedades personalizadas
        this.scene = scene // Guardar la escena como propiedad
        this.setup() // Llamar a la configuración inicial
        scene.time.delayedCall(1000, this.onTimerComplete, [], this)
        this.origen = new Punto(412, 200)
        this.plaga = new Plaga(scene, this.origen, "rana")
        this.plaga.rotar()
        this.plaga.disabledBody()
        this.add(this.plaga)
    }

    onTimerComplete() {
        if (this.total === this.texto.length) {
            this.total = 0          
            this.plaga.x = this.origen.x            
        }
        const actual = this.texto.charAt(this.total)
        this.letra = new Letra(new Punto(this.plaga.x, this.plaga.y), actual, this.total)
        this.total ++
        this.plaga.x += 40
        this.scene.time.delayedCall(1000, this.onTimerComplete, [], this)
    }

    getLetra() {
        return this.letra
    }

    setup() {
        // Configuración inicial del grupo
        // Por ejemplo, añadir físicas, eventos, etc.
        this.scene.physics.add.existing(this, true) // Añadir físicas al grupo (opcional)
    }
}