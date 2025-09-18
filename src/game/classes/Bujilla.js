export class Bujilla {
    constructor(type, damage, rate, range, fromAngle, toAngle) {
        this.type = type;
        this.damage = damage;
        this.rate = rate;
        this.range = range;
        this.angle = {
            min: fromAngle,
            max: toAngle
        }
    }
}