import FuriaDude from "./FuriaDude";
import MultiShoot from "./MultiShot";
import RecargaFierro from "./RecargaFierro";
import Vida from "./Vida";

export default class PowerUpFactory {
    static createPowerUp(type, scene, x, y) {
        switch(type) {
            case 'recarga-fierro':
                return new RecargaFierro(scene, x, y, "tanque");
            case 'vida':
                return new Vida(scene, x, y, "vida");
            case 'furia':
                return new FuriaDude(scene, x, y, "furia");
            case 'weapon':
                return new MultiShoot(scene, x, y, "weapon");
            default:
                console.warn(`Tipo de potenciador desconocido: ${type}`);
                return null;
        }
    }

    static createRandomPowerUp(scene, x, y) {
        const types = ['recarga-fierro', 'vida', 'furia', 'weapon'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return this.createPowerUp(randomType, scene, x, y);
    }
}