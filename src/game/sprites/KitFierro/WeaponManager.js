import Bomba from "./Bomba";
import Honda from "./Honda";
import Honda3Impacto from "./Honda3Impacto";
import LanzaHumo from "./LanzaHumo";
import LanzaLlamas from "./LanzaLlamas";

export default class WeaponManager {
    constructor(scene) {
        this.scene = scene;
        this.weaponInventory = new Map(); // Todas las armas disponibles en el juego
        this.equippedWeapons = []; // Armas que lleva el jugador (máximo 3, por ejemplo)
        this.currentWeaponIndex = 0; // Índice del arma actual en equippedWeapons
        this.initializeWeaponInventory();
    }

    initializeWeaponInventory() {
        // Crear instancias únicas de todas las armas del juego
        const weaponTypes = [
            { key: 'honda', class: Honda },
            { key: 'hondax3', class: Honda3Impacto },
            { key: 'bomba', class: Bomba },
            { key: 'lanzaLlamas', class: LanzaLlamas },
            { key: 'lanzaHumo', class: LanzaHumo },
            // { key: 'laser', class: Laser },
        ];

        weaponTypes.forEach(weaponType => {
            const weapon = new weaponType.class(this.scene);
            weapon.setActive(false);
            weapon.setVisible(false);
            this.weaponInventory.set(weaponType.key, weapon);
        });

        // Equipar armas iniciales
        this.equipInitialWeapons(['honda', 'bomba', 'lanzaLlamas', 'lanzaHumo']);
    }

    equipInitialWeapons(weaponKeys) {
        weaponKeys.forEach(key => {
            const weapon = this.weaponInventory.get(key);
            if (weapon) {
                this.equippedWeapons.push(weapon);
            }
        });

        // Equipar la primera arma
        if (this.equippedWeapons.length > 0) {
            this.equipWeapon(0);
        }
    }

    equipWeapon(index) {
        if (index < 0 || index >= this.equippedWeapons.length) return;

        // Ocultar arma actual
        if (this.equippedWeapons[this.currentWeaponIndex]) {
            this.equippedWeapons[this.currentWeaponIndex].setActive(false);
            this.equippedWeapons[this.currentWeaponIndex].setVisible(false);
        }

        // Mostrar nueva arma
        this.currentWeaponIndex = index;
        const newWeapon = this.equippedWeapons[this.currentWeaponIndex];
        newWeapon.setActive(true);
    }

    switchToNextWeapon() {
        const nextIndex = (this.currentWeaponIndex + 1) % this.equippedWeapons.length;
        this.equipWeapon(nextIndex);
    }

    switchToPreviousWeapon() {
        const prevIndex = (this.currentWeaponIndex - 1 + this.equippedWeapons.length) % this.equippedWeapons.length;
        this.equipWeapon(prevIndex);
    }

    // Método para agregar un arma al inventario del jugador (por ejemplo, al recoger un power-up)
    addWeaponToPlayer(weaponKey) {
        const weapon = this.weaponInventory.get(weaponKey);
        if (!weapon) {
            console.warn(`Arma ${weaponKey} no encontrada en el inventario.`);
            return;
        }

        // Evitar duplicados en las armas equipadas
        if (this.equippedWeapons.includes(weapon)) {
            console.log(`El jugador ya tiene el arma ${weaponKey}.`);
            return;
        }

        // Si ya tenemos 3 armas, reemplazar la actual o usar otro criterio
        if (this.equippedWeapons.length >= 3) {
            // Por ejemplo, reemplazar el arma actual
            this.equippedWeapons[this.currentWeaponIndex] = weapon;
        } else {
            this.equippedWeapons.push(weapon);
        }

        // Equipar el arma recién añadida
        this.equipWeapon(this.equippedWeapons.indexOf(weapon));
    }

    // Método para disparar con el arma actual
    shoot(direction, centerX, centerY, enemigoGroup) {
        const currentWeapon = this.equippedWeapons[this.currentWeaponIndex];
        if (!currentWeapon) return;
        if (!currentWeapon.canShoot || currentWeapon.vacio()) return;
        currentWeapon.shoot(direction, centerX, centerY, enemigoGroup);
    }

    // Método para obtener el arma actual
    getCurrentWeapon() {
        return this.equippedWeapons[this.currentWeaponIndex];
    }

    // Método para mejorar el arma actual (o específica)
    upgradeWeapon(weaponKey, upgradeType) {
        const weapon = this.weaponInventory.get(weaponKey);
        if (weapon && weapon.upgrade) {
            weapon.upgrade(upgradeType);
        }
    }

    // Método para verificar si un arma puede dañar a una rana escondida
    canDamageHiddenFrog(weaponKey, frog) {
        const immuneWeapons = ['bomba', 'lanzallamas', 'lanzahumo'];

        // Si la rana no está escondida, todas las armas funcionan
        if (!frog.isHidden) return true;

        // Si está escondida, verificar si el arma es inmunizada
        return !immuneWeapons.includes(weaponKey);
    }

    // Método para obtener la clave del arma
    getWeaponKey(weapon) {
        let output = ""
        this.weaponInventory.forEach((key, value) => {
            if (key === weapon) {
                output = value;
            };
        });
        return output;
    }

}