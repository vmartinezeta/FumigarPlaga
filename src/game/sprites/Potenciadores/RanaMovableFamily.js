import Phaser from "phaser";
import Rana from "../Enemigos/Rana";
import { Punto } from "../../classes/Punto";

export default class RanaMovableFamily extends Phaser.GameObjects.Group {
    constructor(scene, x, y) {
        super(scene);
        scene.physics.add.existing(this);
        this.ranas = [];
        this.velocidad = new Punto(40, 40);
        this.zona = [];
        this.total = 5;
        this.radio = 50;
        this.type = Math.floor(Math.random() * 2);
        this.agregar(scene, x, y, this.radio, null);
    }

    agregar(scene, x, y, radio, rana) {
        if (rana) {
            this.total--;
            this.ranas.push(rana);
            this.add(rana);
        }
        if (this.total === 0) {
            this.ranas.forEach(rana => {            
                scene.physics.world.removeCollider(rana.collider);
            })
             return;
        }

        const angle = Math.random() * 2 * Math.PI;
        const x1 = x + radio * Math.cos(angle);
        const y1 = y + radio * Math.sin(angle);
        rana = new Rana(scene, x1, y1, "rana", Boolean(this.type), true);
        rana.setVelocidad(this.velocidad.x, this.velocidad.y);
        rana.body.setSize(10, 10);
        rana.collider = scene.physics.add.collider(rana, this, r => {
            r.morir();
        });
        
        scene.time.delayedCall(100, this.agregar, [scene, x, y, radio, rana], this);
    }

}