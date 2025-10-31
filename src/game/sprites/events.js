class OptimizedEventSystem {
    constructor() {
        this.listeners = new Map();
        this.oneTimeListeners = new Map();
    }

    on(event, callback, context) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push({ callback, context });
    }

    once(event, callback, context) {
        if (!this.oneTimeListeners.has(event)) {
            this.oneTimeListeners.set(event, []);
        }
        this.oneTimeListeners.get(event).push({ callback, context });
    }

    off(event, callback, context) {
        // Remover listeners regulares
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event);
            const filtered = listeners.filter(
                listener => !(listener.callback === callback && listener.context === context)
            );
            this.listeners.set(event, filtered);
        }

        // Remover one-time listeners
        if (this.oneTimeListeners.has(event)) {
            const listeners = this.oneTimeListeners.get(event);
            const filtered = listeners.filter(
                listener => !(listener.callback === callback && listener.context === context)
            );
            this.oneTimeListeners.set(event, filtered);
        }
    }

    emit(event, ...args) {
        // Ejecutar listeners regulares
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(({ callback, context }) => {
                callback.apply(context, args);
            });
        }

        // Ejecutar y limpiar one-time listeners
        if (this.oneTimeListeners.has(event)) {
            const listeners = this.oneTimeListeners.get(event);
            listeners.forEach(({ callback, context }) => {
                callback.apply(context, args);
            });
            this.oneTimeListeners.delete(event);
        }
    }

    clear() {
        this.listeners.clear();
        this.oneTimeListeners.clear();
    }

}