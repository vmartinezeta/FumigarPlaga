import WaterPool from "./Waterpool";

export default class WaterPoolManager {
    constructor(scene) {
        this.scene = scene;
        this.pools = [];
        this.spawnConfig = {
            minPools: 2,
            maxPools: 5,
            minSize: 80,
            maxSize: 150,
            spawnInterval: 30000, // 30 segundos
            maxPoolsOnScreen: 8
        };
        
        this.initializePools();
        this.setupSpawning();
    }
    
    initializePools() {
        const poolCount = Phaser.Math.Between(
            this.spawnConfig.minPools, 
            this.spawnConfig.maxPools
        );
        
        for (let i = 0; i < poolCount; i++) {
            this.spawnRandomPool();
        }
    }
    
    setupSpawning() {
        this.scene.time.addEvent({
            delay: this.spawnConfig.spawnInterval,
            callback: this.spawnRandomPool,
            callbackScope: this,
            loop: true
        });
    }
    
    spawnRandomPool() {
        if (this.pools.length >= this.spawnConfig.maxPoolsOnScreen) return;
        
        const margin = 100;
        const x = Phaser.Math.Between(margin, this.scene.width - margin);
        const y = Phaser.Math.Between(this.scene.ymax, this.scene.game.config.height - margin);
        
        const size = Phaser.Math.Between(this.spawnConfig.minSize, this.spawnConfig.maxSize);
        
        const pool = new WaterPool(this.scene, x, y, size, size * 0.7);
        this.pools.push(pool);
        
        // Desaparecer después de un tiempo
        this.scene.time.delayedCall(45000, () => {
            this.removePool(pool);
        });
    }
    
    removePool(pool) {
        const index = this.pools.indexOf(pool);
        if (index > -1) {
            pool.destroy();
            this.pools.splice(index, 1);
        }
    }
    
    update() {
        this.pools.forEach(pool => pool.update());
    }
    
    isFrogHidden(frog) {
        return this.pools.some(pool => pool.hiddenFrogs.has(frog));
    }
    
    getPoolsAffectingFrog(frog) {
        return this.pools.filter(pool => {
            const distance = Phaser.Math.Distance.Between(
                pool.x, pool.y, frog.x, frog.y
            );
            return distance <= pool.hideRadius;
        });
    }

}