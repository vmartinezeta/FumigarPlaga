import Phaser from "phaser";

export default class WeaponDock extends Phaser.GameObjects.Group{
    constructor(scene, player) {
        super(scene);
        this.scene = scene;
        this.player = player;
        this.weapons = []; // Array de armas del jugador
        this.selectedWeaponIndex = 0;
        this.dockGroup = null;
        this.createDock();
        this.setDepth(20);
        this.setVisible(false);
        this.timer = null;
        scene.physics.add.existing(this);
    }

    createDock() {
        // Crear grupo para el dock
        // this.dockGroup = this.scene.add.group();
        // this.dockGroup.setDepth(20);
        const dockWidth = 300;
        const dockHeight = 80;
        const startX = this.scene.game.config.width / 2 - dockWidth / 2;
        const startY = this.scene.game.config.height - dockHeight - 20;

        // Fondo del dock
        const background = this.scene.add.rectangle(
            startX + dockWidth / 2, 
            startY + dockHeight / 2, 
            dockWidth,
            dockHeight, 
            0x000000,
            0.7
        );
        background.setStrokeStyle(2, 0xffffff);
        background.setScrollFactor(0);
        // this.dockGroup.add(background);
        this.add(background);

        // Espacio para iconos de armas
        this.weaponSlots = [];
        const slotSize = 60;
        const slotSpacing = 70;
        
        // Crear slots para armas (máximo 4 armas)
        for (let i = 0; i < 4; i++) {
            const slotX = startX + 40 + (i * slotSpacing);
            const slotY = startY + dockHeight / 2;

            // Fondo del slot
            const slotBg = this.scene.add.rectangle(
                slotX, slotY, slotSize, slotSize, 0x333333, 0.8
            );
            slotBg.setStrokeStyle(2, 0x666666);
            slotBg.setScrollFactor(0);
            // this.dockGroup.add(slotBg);
            this.add(slotBg);

            // Texto del número del slot
            const slotNumber = this.scene.add.text(
                slotX - slotSize/2 + 5, 
                slotY - slotSize/2 + 5, 
                (i + 1).toString(), 
                { fontSize: '12px', fill: '#ffffff' }
            );
            // this.dockGroup.add(slotNumber);
            slotNumber.setScrollFactor(0);
            this.add(slotNumber);

            this.weaponSlots.push({
                background: slotBg,
                icon: null,
                number: slotNumber,
                index: i
            });
        }


        // Actualizar dock inicialmente
        // this.updateDock();

        // Configurar inputs para cambiar armas
        this.setupInputs();
    }

    // Agregar un arma al dock
    addWeapon(weaponConfig) {
        this.weapons.push(weaponConfig);
        // this.updateDock();
    }

    // Actualizar la visualización del dock
    updateDock() {
        // Limpiar iconos existentes
        this.weaponSlots.forEach(slot => {
            if (slot.icon) {
                slot.icon.destroy();
                slot.icon = null;
            }
        });

        // Crear nuevos iconos para las armas disponibles
        this.weapons.forEach((weapon, index) => {
            if (index < this.weaponSlots.length) {
                const slot = this.weaponSlots[index];

                // Crear icono del arma
                slot.icon = this.scene.add.sprite(
                    slot.background.x,
                    slot.background.y, 
                    weapon.iconTexture
                );
                
                slot.icon.setScrollFactor(0);
                slot.icon.setDisplaySize(40, 40);
                slot.icon.setDepth(20);
                // this.dockGroup.add(slot.icon);
                this.add(slot.icon);

                // Actualizar apariencia según selección
                this.updateSlotAppearance(slot, index);
            }
        });
    }

    // Actualizar apariencia de un slot
    updateSlotAppearance(slot, index) {
        const isSelected = index === this.selectedWeaponIndex;
        const hasWeapon = index < this.weapons.length;

        if (hasWeapon) {
            if (isSelected) {
                slot.background.setStrokeStyle(3, 0x00ff00);
                slot.background.setFillStyle(0x444444);
            } else {
                slot.background.setStrokeStyle(2, 0xffffff);
                slot.background.setFillStyle(0x333333);
            }
        } else {
            slot.background.setStrokeStyle(2, 0x666666);
            slot.background.setFillStyle(0x222222);
        }
    }

    // Seleccionar arma
    selectWeapon(index) {
        if (index >= 0 && index < this.weapons.length) {
            this.selectedWeaponIndex = index;
            this.setVisible(true);
            this.updateDock();

            this.scene.time.removeEvent(this.timer);
            this.timer = this.scene.time.delayedCall(1000, this.ocultar, [], this);
            // Cambiar arma del jugador
            // this.player.equipWeapon(this.weapons[index]);
            
            return true;
        }
        return false;
    }

    ocultar() {
        this.setVisible(false);
    }

    // Configurar controles de entrada
    setupInputs() {
        // Teclas numéricas (1-4)
        for (let i = 1; i <= 4; i++) {
            this.scene.input.keyboard.on(`keydown-${i}`, () => {
                this.selectWeapon(i - 1);
            });
        }

        // Rueda del mouse
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (deltaY > 0) {
                // Scroll hacia abajo - siguiente arma
                this.nextWeapon();
            } else {
                // Scroll hacia arriba - arma anterior
                this.previousWeapon();
            }
        });

        // Clicks en los slots
        this.weaponSlots.forEach((slot, index) => {
            slot.background.setInteractive();
            slot.background.on('pointerdown', () => {
                if (index < this.weapons.length) {
                    this.selectWeapon(index);
                }
            });
        });
    }

    // Siguiente arma
    nextWeapon() {
        let nextIndex = this.selectedWeaponIndex + 1;
        if (nextIndex >= this.weapons.length) {
            nextIndex = 0;
        }
        this.selectWeapon(nextIndex);
    }

    // Arma anterior
    previousWeapon() {
        let prevIndex = this.selectedWeaponIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.weapons.length - 1;
        }
        this.selectWeapon(prevIndex);
    }

    // Ocultar/mostrar el dock
    // setVisible(visible) {
    //     // this.dockGroup.setVisible(visible);
    //     // this.setVisible(true);
    // }

    // Obtener arma actual
    getCurrentWeapon() {
        return this.weapons[this.selectedWeaponIndex];
    }

}


// Ejemplo de uso en tu escena principal
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.weaponDock = null;
    }

    create() {
        // Crear jugador
        this.player = new Player(this, 400, 300);
        
        // Crear dock de armas
        this.weaponDock = new WeaponDock(this, this.player);
        
        // Agregar algunas armas de ejemplo
        this.weaponDock.addWeapon({
            name: 'Pistola',
            iconTexture: 'pistol_icon',
            damage: 10,
            fireRate: 0.5
        });

        this.weaponDock.addWeapon({
            name: 'Escopeta',
            iconTexture: 'shotgun_icon',
            damage: 25,
            fireRate: 1.0
        });

        this.weaponDock.addWeapon({
            name: 'Rifle',
            iconTexture: 'rifle_icon',
            damage: 15,
            fireRate: 0.3
        });
    }

    update() {
        // Tu lógica de juego...
    }
}

// Clase Player de ejemplo
class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.currentWeapon = null;
        // ... resto de tu código del jugador
    }

    equipWeapon(weapon) {
        this.currentWeapon = weapon;
        console.log(`Arma equipada: ${weapon.name}`);
        // Aquí agregas la lógica para cambiar el arma real del jugador
    }

}