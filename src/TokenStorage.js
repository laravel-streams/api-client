/**
 * Pluggable session-token storage.
 *
 * Adapters implement get(), set(token), and clear(). Use memory in Node and
 * tests, Web Storage in a browser, or secureStorageAdapter for a Capacitor
 * plugin with get/set/remove. The adapter stores whatever string the app
 * gives it. This module never writes a token of its own.
 */

export class MemoryTokenStorage {
    constructor(token = null) {
        this.token = normalizeStoredToken(token);
    }

    async get() {
        return this.token;
    }

    async set(token) {
        this.token = normalizeStoredToken(token);
    }

    async clear() {
        this.token = null;
    }
}

/**
 * Browser localStorage or sessionStorage, or any object with the Storage methods.
 */
export class WebStorageTokenStorage {
    constructor(storage, key = 'streams.auth.token') {
        if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function' || typeof storage.removeItem !== 'function') {
            throw new TypeError('WebStorageTokenStorage requires getItem, setItem, and removeItem');
        }
        if (typeof key !== 'string' || key.trim() === '') {
            throw new TypeError('WebStorageTokenStorage requires a storage key');
        }
        this.storage = storage;
        this.key = key;
    }

    async get() {
        return this.storage.getItem(this.key);
    }

    async set(token) {
        const value = normalizeStoredToken(token);
        if (value == null) {
            this.storage.removeItem(this.key);
            return;
        }
        this.storage.setItem(this.key, value);
    }

    async clear() {
        this.storage.removeItem(this.key);
    }
}

/**
 * Wrap a Capacitor-style plugin: get({ key }), set({ key, value }), remove({ key }).
 * A missing key resolves to null. Other plugin failures reject.
 */
export function secureStorageAdapter(plugin, key = 'streams.auth.token') {
    if (!plugin || typeof plugin.get !== 'function' || typeof plugin.set !== 'function' || typeof plugin.remove !== 'function') {
        throw new TypeError('secureStorageAdapter requires get, set, and remove');
    }
    if (typeof key !== 'string' || key.trim() === '') {
        throw new TypeError('secureStorageAdapter requires a storage key');
    }

    return {
        async get() {
            try {
                const result = await plugin.get({ key });
                if (result == null) return null;
                if (typeof result === 'string') return result === '' ? null : result;
                if (typeof result.value !== 'string' || result.value === '') return null;
                return result.value;
            } catch (error) {
                if (isMissingKey(error)) return null;
                throw error;
            }
        },

        async set(token) {
            const value = normalizeStoredToken(token);
            if (value == null) {
                await this.clear();
                return;
            }
            await plugin.set({ key, value });
        },

        async clear() {
            try {
                await plugin.remove({ key });
            } catch (error) {
                if (isMissingKey(error)) return;
                throw error;
            }
        },
    };
}

/**
 * Pick an adapter from an existing get/set/clear store, Web Storage, or a secure-storage plugin.
 * A missing source becomes an empty memory store.
 */
export function createTokenStorage(source, options = {}) {
    if (source == null) {
        return new MemoryTokenStorage(options.token ?? null);
    }
    if (typeof source.get === 'function' && typeof source.set === 'function' && typeof source.clear === 'function') {
        return source;
    }
    if (typeof source.getItem === 'function' && typeof source.setItem === 'function' && typeof source.removeItem === 'function') {
        return new WebStorageTokenStorage(source, options.key);
    }
    if (typeof source.get === 'function' && typeof source.set === 'function' && typeof source.remove === 'function') {
        return secureStorageAdapter(source, options.key);
    }
    throw new TypeError('Token storage must implement get/set/clear, Web Storage, or get/set/remove');
}

function normalizeStoredToken(token) {
    if (token == null) return null;
    if (typeof token !== 'string') {
        throw new TypeError('token must be a string');
    }
    const value = token.trim();
    return value === '' ? null : value;
}

function isMissingKey(error) {
    const message = String(error?.message || error || '');
    return /not found|does not exist|item not found|no value/i.test(message);
}
