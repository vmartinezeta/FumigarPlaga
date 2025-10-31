class FrogManager {
    constructor(scene) {
        this.scene = scene;
        this.frogPool = new FrogPool(scene);
        this.frogs = []; // Ranás activas
        // ... resto de código
    }

    spawnFrog(x, y) {
        const frog = this.frogPool.getFrog(x, y);
        this.frogs.push(frog);
        return frog;
    }

    removeFrog(frog) {
        const index = this.frogs.indexOf(frog);
        if (index > -1) {
            this.frogs.splice(index, 1);
        }
        this.frogPool.returnFrog(frog);
    }
}