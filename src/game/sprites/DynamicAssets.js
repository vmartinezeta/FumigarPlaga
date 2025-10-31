class DynamicAssetManager {
    constructor(scene) {
        this.scene = scene;
        this.loadedAssets = new Set();
        this.assetsInUse = new Map(); // assetKey -> [usuarios]
    }

    // Cargar assets solo cuando se necesiten
    loadAsset(assetKey, assetType, user) {
        if (!this.loadedAssets.has(assetKey)) {
            // Cargar el asset
            this.scene.load[assetType](assetKey, `assets/${assetType}/${assetKey}.png`);
            this.scene.load.start();
            this.loadedAssets.add(assetKey);
        }

        // Registrar usuario del asset
        if (!this.assetsInUse.has(assetKey)) {
            this.assetsInUse.set(assetKey, new Set());
        }
        this.assetsInUse.get(assetKey).add(user);
    }

    // Liberar assets no utilizados
    releaseAsset(assetKey, user) {
        if (this.assetsInUse.has(assetKey)) {
            const users = this.assetsInUse.get(assetKey);
            users.delete(user);
            
            if (users.size === 0) {
                // Liberar textura de memoria
                this.scene.textures.remove(assetKey);
                this.loadedAssets.delete(assetKey);
                this.assetsInUse.delete(assetKey);
            }
        }
    }

    // Limpiar assets de un usuario específico
    cleanupUserAssets(user) {
        this.assetsInUse.forEach((users, assetKey) => {
            if (users.has(user)) {
                this.releaseAsset(assetKey, user);
            }
        });
    }
}