// PowerUpFactory.js
import TanqueConAgua from './TanqueConAgua.js';
import Vida from './Vida.js';
import FuriaDude from './FuriaDude.js';

export default class PowerUpFactory {
    static createPowerUp(type, scene, x, y) {
        switch(type) {
            case 'tanque':
                return new TanqueConAgua(scene, x, y);
            case 'vida':
                return new Vida(scene, x, y);
            case 'furia':
                return new FuriaDude(scene, x, y);
            default:
                console.warn(`Tipo de potenciador desconocido: ${type}`);
                return null;
        }
    }
    
    static createRandomPowerUp(scene, x, y) {
        const types = ['tanque', 'vida', 'furia'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        return this.createPowerUp(randomType, scene, x, y);
    }
}