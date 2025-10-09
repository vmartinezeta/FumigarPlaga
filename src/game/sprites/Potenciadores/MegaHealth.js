import Potenciador from "./Potenciador";

export default class MegaHealth extends Potenciador{
    applyEffect(player) {
        player.vida = player.vida + 100;
    }

}