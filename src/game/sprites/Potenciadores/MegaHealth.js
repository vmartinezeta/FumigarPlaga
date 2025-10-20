import PowerUp from "./PowerUp";

export default class MegaHealth extends PowerUp{
    applyEffect(player) {
        player.vida = player.vida + 100;
    }

}