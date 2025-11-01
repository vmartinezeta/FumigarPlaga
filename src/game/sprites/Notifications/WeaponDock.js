import Phaser from "phaser";

export default class WeaponDock extends Phaser.GameObjects.Group{
    constructor(scene, weaponManager) {
        super(scene);
        this.scene = scene;
        this.weaponManager = weaponManager;
        // this.weaponManager.equippedWeapons = []; // Array de armas del jugador
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
        this.updateDock();

        // Configurar inputs para cambiar armas
        this.setupInputs();
    }

    // Agregar un arma al dock
    addWeapon(weaponConfig) {
        // this.weaponManager.equippedWeapons.push(weaponConfig);
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
        this.weaponManager.equippedWeapons.forEach((weapon, index) => {
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
        const hasWeapon = index < this.weaponManager.equippedWeapons.length;

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
        if (index >= 0 && index < this.weaponManager.equippedWeapons.length) {
            this.selectedWeaponIndex = index;
            this.setVisible(true);
            this.updateDock();

            this.scene.time.removeEvent(this.timer);
            this.timer = this.scene.time.delayedCall(1000, this.ocultar, [], this);
            // Cambiar arma del jugador

            const currentWeapon = this.weaponManager.getCurrentWeapon();
            this.scene.eventBus.emit("fierroChanged",{fierro: this.weaponManager.getWeaponKey(currentWeapon)});
            
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
        const teclas = ['ONE', 'TWO', 'THREE', 'FOUR'];
        for (let i = 0; i < 4; i++) {
            this.scene.input.keyboard.on(`keydown-${teclas[i]}`, () => {
                this.selectWeapon(i);
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
                if (index < this.weaponManager.equippedWeapons.length) {
                    this.selectWeapon(index);
                }
            });
        });
    }

    // Siguiente arma
    nextWeapon() {
        let nextIndex = this.selectedWeaponIndex + 1;
        if (nextIndex >= this.weaponManager.equippedWeapons.length) {
            nextIndex = 0;
        }
        this.selectWeapon(nextIndex);
    }

    // Arma anterior
    previousWeapon() {
        let prevIndex = this.selectedWeaponIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.weaponManager.equippedWeapons.length - 1;
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
        return this.weaponManager.equippedWeapons[this.selectedWeaponIndex];
    }

}