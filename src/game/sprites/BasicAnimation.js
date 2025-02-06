import Phaser from "phaser"
import Plaga from "./Plaga";
import { Punto } from "../classes/Punto";
import { Letra } from "../classes/Letra";

export default class BasicAnimation extends Phaser.GameObjects.Group {
    constructor(scene, children, config) {
        // Llamar al constructor de la clase padre (Phaser.GameObjects.Group)
        super(scene, children, config)
        this.index = 0
        this.texto = "FUMIGAR"
        this.letra = null        
        // Inicializar propiedades personalizadas
        this.scene = scene // Guardar la escena como propiedad
        this.setup() // Llamar a la configuración inicial
        // scene.time.delayedCall(1000, this.onTimerComplete, [], this)
        this.origen = new Punto(350, 200)
        this.plaga = new Plaga(scene, this.origen, "rana")
        this.plaga.rotar()
        this.plaga.disabledBody()
        this.add(this.plaga)
        this.stop = false
    }

    parar() {
        this.stop = true
    }

    reset() {
        this.stop = false
        this.index = 0  
        this.plaga.x = this.origen.x     
    }

    getLetra(sceneCallback) {
        if (this.stop) {
            return
        }
        const actual = this.texto.charAt(this.index)
        const {x, y} = this.plaga
        sceneCallback(new Letra(new Punto(x, y), actual, this.index, this.texto.length-1))
        this.plaga.x += 50
        this.index ++
        this.scene.time.delayedCall(1000, this.getLetra, [sceneCallback], this)
    }

    setup() {
        // Configuración inicial del grupo
        // Por ejemplo, añadir físicas, eventos, etc.
        this.scene.physics.add.existing(this, true) // Añadir físicas al grupo (opcional)
    }
}