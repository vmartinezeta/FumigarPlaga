import Phaser from "phaser";

export default class WeaponCarousel extends Phaser.GameObjects.Group {
    constructor(scene, player) {
        super(scene);
        this.scene = scene;
        this.player = player;
        this.weapons = [];
        this.selectedWeaponIndex = 0;
        this.carouselGroup = null;
        this.slots = [];

        this.createCarousel();
    }

    createCarousel() {
        this.carouselGroup = this.scene.add.group();
        
        const centerX = this.scene.game.config.width / 2;
        const bottomY = this.scene.game.config.height - 100;

        // Crear slots del carrusel (máximo 5 slots visibles)
        for (let i = 0; i < 5; i++) {
            const slot = this.createSlot(i, centerX, bottomY);
            this.slots.push(slot);
            this.carouselGroup.add(slot.background);
            if (slot.icon) this.carouselGroup.add(slot.icon);
            if (slot.nameText) this.carouselGroup.add(slot.nameText);
        }

        this.updateCarousel();
        this.carouselGroup.setDepth(20);

        // Configurar inputs
        this.setupInputs();
    }

    createSlot(position, centerX, bottomY) {
        const slot = {
            background: null,
            icon: null,
            nameText: null,
            position: position, // -2, -1, 0, 1, 2 (0 = centro)
            weaponIndex: null
        };

        // Calcular posición y tamaño según la posición en el carrusel
        let x, y, size, alpha, scale;
        
        switch(position) {
            case 0: // Centro - arma actual
                x = centerX;
                y = bottomY - 20;
                size = 80;
                alpha = 1;
                scale = 1.2;
                break;
            case -1: // Izquierda
                x = centerX - 100;
                y = bottomY;
                size = 60;
                alpha = 0.8;
                scale = 0.9;
                break;
            case 1: // Derecha
                x = centerX + 100;
                y = bottomY;
                size = 60;
                alpha = 0.8;
                scale = 0.9;
                break;
            case -2: // Izquierda lejana
                x = centerX - 180;
                y = bottomY + 10;
                size = 50;
                alpha = 0.5;
                scale = 0.7;
                break;
            case 2: // Derecha lejana
                x = centerX + 180;
                y = bottomY + 10;
                size = 50;
                alpha = 0.5;
                scale = 0.7;
                break;
        }

        // Fondo del slot
        slot.background = this.scene.add.rectangle(x, y, size, size, 0x000000, 0.8);
        slot.background.setStrokeStyle(2, 0xffffff);
        slot.background.setAlpha(alpha);
        slot.background.setInteractive();

        // Configurar el slot para recibir clicks
        slot.background.on('pointerdown', () => {
            if (slot.weaponIndex !== null) {
                this.selectWeapon(slot.weaponIndex);
            }
        });

        return slot;
    }

    addWeapon(weaponConfig) {
        this.weapons.push(weaponConfig);
        this.updateCarousel();
    }

    updateCarousel() {
        // Limpiar iconos y textos anteriores
        this.slots.forEach(slot => {
            if (slot.icon) {
                slot.icon.destroy();
                slot.icon = null;
            }
            if (slot.nameText) {
                slot.nameText.destroy();
                slot.nameText = null;
            }
        });

        if (this.weapons.length === 0) return;

        // Actualizar cada slot con su arma correspondiente
        this.slots.forEach(slot => {
            const weaponIndex = this.getWeaponIndexForSlot(slot.position);
            
            if (weaponIndex !== null && weaponIndex < this.weapons.length) {
                const weapon = this.weapons[weaponIndex];
                slot.weaponIndex = weaponIndex;

                // Crear icono del arma
                slot.icon = this.scene.add.sprite(
                    slot.background.x,
                    slot.background.y - 15,
                    weapon.iconTexture
                );

                // Ajustar escala según la posición
                let scale;
                switch(slot.position) {
                    case 0: scale = 1.0; break;
                    case -1: case 1: scale = 0.8; break;
                    case -2: case 2: scale = 0.6; break;
                }
                slot.icon.setScale(scale);

                // Agregar nombre del arma solo para el slot central
                if (slot.position === 0) {
                    slot.nameText = this.scene.add.text(
                        slot.background.x,
                        slot.background.y + slot.background.height / 2 + 10,
                        weapon.name,
                        { 
                            fontSize: '14px', 
                            fill: '#ffffff',
                            fontStyle: 'bold',
                            stroke: '#000000',
                            strokeThickness: 3
                        }
                    );
                    slot.nameText.setOrigin(0.5, 0);
                    this.carouselGroup.add(slot.nameText);
                }

                // Actualizar apariencia visual
                this.updateSlotAppearance(slot);
                
                this.carouselGroup.add(slot.icon);
            } else {
                slot.weaponIndex = null;
                slot.background.setFillStyle(0x222222, 0.5);
                slot.background.setStrokeStyle(1, 0x666666);
            }
        });
    }

    getWeaponIndexForSlot(slotPosition) {
        if (this.weapons.length === 0) return null;

        let index = this.selectedWeaponIndex + slotPosition;
        
        // Asegurar que el índice esté dentro del rango (carrusel circular)
        if (index < 0) {
            index = this.weapons.length + (index % this.weapons.length);
        } else if (index >= this.weapons.length) {
            index = index % this.weapons.length;
        }

        return index;
    }

    updateSlotAppearance(slot) {
        const isCenter = slot.position === 0;
        
        if (isCenter) {
            slot.background.setFillStyle(0x2d5c4d, 0.9); // Verde oscuro para selección
            slot.background.setStrokeStyle(3, 0x4cd964); // Verde brillante
            slot.background.setAlpha(1);
        } else {
            slot.background.setFillStyle(0x000000, 0.8);
            slot.background.setStrokeStyle(2, 0xffffff);
            
            // Ajustar alpha según la distancia del centro
            if (Math.abs(slot.position) === 1) {
                slot.background.setAlpha(0.8);
            } else {
                slot.background.setAlpha(0.5);
            }
        }
    }

    selectWeapon(index) {
        if (index >= 0 && index < this.weapons.length) {
            this.selectedWeaponIndex = index;
            this.updateCarousel();
            
            // Cambiar arma del jugador
            // this.player.equipWeapon(this.weapons[index]);
            
            // Efecto visual de selección
            this.playSelectionEffect();
            
            return true;
        }
        return false;
    }

    playSelectionEffect() {
        // Efecto de escala en el slot central
        const centerSlot = this.slots.find(slot => slot.position === 0);
        if (centerSlot && centerSlot.background) {
            this.scene.tweens.add({
                targets: [centerSlot.background, centerSlot.icon],
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
        }
    }

    setupInputs() {
        // Flechas izquierda/derecha
        this.scene.input.keyboard.on('keydown-ONE', () => {
            this.previousWeapon();
        });

        this.scene.input.keyboard.on('keydown-TWO', () => {
            this.nextWeapon();
        });

        // Rueda del mouse
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (deltaY > 0) {
                this.nextWeapon();
            } else {
                this.previousWeapon();
            }
        });

        // Teclas numéricas para selección directa
        for (let i = 1; i <= 5; i++) {
            this.scene.input.keyboard.on(`keydown-${i}`, () => {
                if (i - 1 < this.weapons.length) {
                    this.selectWeapon(i - 1);
                }
            });
        }

        // Tecla Q y E como alternativas
        this.scene.input.keyboard.on('keydown-Q', () => {
            this.previousWeapon();
        });

        this.scene.input.keyboard.on('keydown-E', () => {
            this.nextWeapon();
        });
    }

    nextWeapon() {
        if (this.weapons.length <= 1) return;
        
        let nextIndex = this.selectedWeaponIndex + 1;
        if (nextIndex >= this.weapons.length) {
            nextIndex = 0;
        }
        this.selectWeapon(nextIndex);
    }

    previousWeapon() {
        if (this.weapons.length <= 1) return;
        
        let prevIndex = this.selectedWeaponIndex - 1;
        if (prevIndex < 0) {
            prevIndex = this.weapons.length - 1;
        }
        this.selectWeapon(prevIndex);
    }

    setVisible(visible) {
        this.carouselGroup.setVisible(visible);
    }

    getCurrentWeapon() {
        return this.weapons[this.selectedWeaponIndex];
    }

    // Método para manejar cambios en las armas del jugador
    updateWeapons(newWeapons) {
        this.weapons = newWeapons;
        if (this.selectedWeaponIndex >= this.weapons.length) {
            this.selectedWeaponIndex = Math.max(0, this.weapons.length - 1);
        }
        this.updateCarousel();
    }
}

// Ejemplo de uso en tu escena principal
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.weaponCarousel = null;
    }

    preload() {
        // Cargar texturas de iconos de armas
        this.load.image('sword_icon', 'assets/weapons/sword.png');
        this.load.image('bow_icon', 'assets/weapons/bow.png');
        this.load.image('bomb_icon', 'assets/weapons/bomb.png');
        this.load.image('boomerang_icon', 'assets/weapons/boomerang.png');
        this.load.image('hookshot_icon', 'assets/weapons/hookshot.png');
    }

    create() {
        // Crear jugador
        this.player = new Player(this, 400, 300);
        
        // Crear carrusel de armas
        this.weaponCarousel = new WeaponCarousel(this, this.player);
        
        // Agregar armas de ejemplo (estilo Zelda)
        this.weaponCarousel.addWeapon({
            name: 'Espada',
            iconTexture: 'sword_icon',
            damage: 20,
            type: 'melee'
        });

        this.weaponCarousel.addWeapon({
            name: 'Arco',
            iconTexture: 'bow_icon',
            damage: 15,
            type: 'ranged'
        });

        this.weaponCarousel.addWeapon({
            name: 'Bombas',
            iconTexture: 'bomb_icon',
            damage: 30,
            type: 'explosive'
        });

        this.weaponCarousel.addWeapon({
            name: 'Boomerang',
            iconTexture: 'boomerang_icon',
            damage: 10,
            type: 'ranged'
        });

        this.weaponCarousel.addWeapon({
            name: 'Gancho',
            iconTexture: 'hookshot_icon',
            damage: 5,
            type: 'utility'
        });

        // Instrucciones en pantalla
        this.add.text(20, 20, 'Controles:\nFlechas/Q-E: Cambiar arma\nRueda ratón: Cambiar arma\nClic en iconos: Seleccionar', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        });
    }

    update() {
        // Tu lógica de juego...
    }
}