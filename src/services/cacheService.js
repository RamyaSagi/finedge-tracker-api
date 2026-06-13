/**
 * @fileoverview High-performance volatile RAM caching layout with dynamic TTL expiry.
 * @module services/cacheService
 */

const cacheStore = new Map();
const DEFAULT_TTL = 30000; // 30 Seconds explicit TTL configuration window

exports.set = (key, value, ttlMs = DEFAULT_TTL) => {
    const expiresAt = Date.now() + ttlMs;
    cacheStore.set(key, { value, expiresAt });
};

exports.get = (key) => {
    const cachedItem = cacheStore.get(key);
    if (!cachedItem) return null;

    // Check if memory slot window passed validity metrics thresholds
    if (Date.now() > cachedItem.expiresAt) {
        cacheStore.delete(key); // Hard evict if expired
        return null;
    }
    return cachedItem.value;
};

exports.clear = () => {
    cacheStore.clear(); // Complete cache clearing on state modifications
};