import Rana from "../Enemigos/Rana";
import RanaFamily from "./RanaFamily";


export default class RanaStaticFamily extends RanaFamily {
    constructor(scene, x, y, ranaCount = 5, radius = 80) {
        super(scene, x, y, 'static', ranaCount, radius);
        this.setupStaticBehavior();
    }

    createRana(x, y) {
        // Crear rana estática (usa tu clase Rana existente)
        const rana = new Rana(this.scene, x, y, "rana", false, true,20);
        rana.updateSize(300, 600);
        // Configurar propiedades específicas de ranas estáticas
        rana.isStatic = true;
        
        // Configurar física
        rana.body.setSize(20, 20);
        rana.body.setOffset(6, 6);
        rana.body.setVelocity(0);
        return rana;
    }

    setupStaticBehavior() {
        // Comportamiento específico para ranas estáticas
        this.children.entries.forEach(rana => {
            // Las ranas estáticas pueden tener ataques a distancia
            this.setupRangedAttack(rana);
        });
    }

    setupRangedAttack(rana) {
        // Ataque de proyectiles cada 3 segundos
        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                if (rana.active && this.scene.player.active) {
                    this.shootAtPlayer(rana);
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    shootAtPlayer(rana) {
        const player = this.scene.player;
        const angle = Phaser.Math.Angle.Between(rana.x, rana.y, player.x, player.y);
        // Crear proyectil
        const projectile = this.scene.physics.add.sprite(rana.x, rana.y, 'particle');
        projectile.setScale(.4);
        projectile.setRotation(angle);
        projectile.damage = 10;
        
        // Velocidad del proyectil
        const speed = 150;
        this.scene.physics.velocityFromRotation(angle, speed, projectile.body.velocity);
        
        // Auto-destrucción después de tiempo
        this.scene.time.delayedCall(3000, () => {
            if (projectile.active) {
                projectile.destroy();
            }
        });
    }
}