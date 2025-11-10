"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCache = void 0;
class InMemoryCache {
    constructor(ttlSeconds) {
        this.ttlSeconds = ttlSeconds;
        this.store = new Map();
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry) {
            return null;
        }
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }
    set(key, value, ttlSeconds) {
        const ttl = (ttlSeconds ?? this.ttlSeconds) * 1000;
        this.store.set(key, { value, expiresAt: Date.now() + ttl });
    }
    delete(key) {
        this.store.delete(key);
    }
    clear() {
        this.store.clear();
    }
}
const createCache = (ttlSeconds) => new InMemoryCache(ttlSeconds);
exports.createCache = createCache;
//# sourceMappingURL=cache.js.map