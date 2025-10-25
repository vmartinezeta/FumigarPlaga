export default class Fierro extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, imageKey, type, capacidad) {
        super(scene, x, y, imageKey);
        this.scene = scene;
        this.imageKey = imageKey;
        this.type = type;
        this.fireRate = 500; // ms entre disparos
        this.damage = 10;
        this.collider = null;
        this.capacidad = capacidad;
        this.capacidadMax = capacidad;
        this.setVisible(false);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.canShoot = true;
        // Configurar hitbox según el tipo de arma
        this.setupHitbox();
    }

    nextShoot() {
        this.capacidad--;
        this.canShoot = false;
        if (!this.scene) return;
        this.scene.time.delayedCall(this.fireRate+100, () => {
            this.canShoot = true;
        });
    }

    vacio() {
        return this.capacidad === 0;
    }

    reset() {
        this.capacidad = this.capacidadMax;
    }

    setupHitbox() {
        switch(this.type) {
            case 'honda':
                this.body.setSize(8, 8);
                this.body.setOffset(4, 4);
                break;
            case 'honda3Impact': 
                this.body.setSize(15, 30);
                this.body.setOffset(0, -10);
            break;
            case 'bomba':
                this.body.setSize(12, 12);
                this.body.setOffset(2, 2);
                break;
            case 'lanzallamas':
                this.body.setSize(20, 6);
                this.body.setOffset(0, 5);
                break;
            case 'lanzaHumo':
                this.body.setSize(15, 15);
                this.body.setOffset(1, 1);
                break;
        }
    }
    
}