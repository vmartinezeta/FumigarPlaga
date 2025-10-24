// Clase base para armas con control de instancia única
class ArmaBase extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        // Verificar si ya existe una instancia
        if (ArmaBase.instances && ArmaBase.instances[texture]) {
            return ArmaBase.instances[texture];
        }
        
        super(scene, x, y, texture);
        
        // Registrar instancia
        if (!ArmaBase.instances) {
            ArmaBase.instances = {};
        }
        ArmaBase.instances[texture] = this;
        
        this.setActive(false);
        this.setVisible(false);
        scene.add.existing(this);
    }
}

// Armas específicas
class Honda extends ArmaBase {
    constructor(scene, x = 0, y = 0) {
        super(scene, x, y, 'honda-texture');
        this.damage = 10;
        this.fireRate = 500;
    }
    
    shoot() {
        // Lógica de disparo específica
        console.log('Disparando con Honda');
    }
}

class Bomba extends ArmaBase {
    constructor(scene, x = 0, y = 0) {
        super(scene, x, y, 'bomba-texture');
        this.damage = 50;
        this.fireRate = 1000;
    }
    
    shoot() {
        // Lógica de disparo específica
        console.log('Lanzando Bomba');
    }
}