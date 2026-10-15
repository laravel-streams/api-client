import { Middleware } from './Middleware.js';

/**
 * Puts the session token on each request and reports an expired session.
 *
 * The token is kept in memory and, when a storage adapter is set, loaded
 * from and written to that adapter. Pass `{ authorization: false }` to skip
 * the header on one request (login and magic-link calls).
 *
 * A 401 from a request that sent Authorization calls `onUnauthorized` once.
 * `setToken` arms the hook again. Credential failures that did not send a
 * token do not call the hook. The original error is still thrown.
 */
export class AuthorizationMiddleware extends Middleware {
    constructor(options = {}) {
        const { token = null, type = 'Bearer', storage = null, onUnauthorized = null, priority, ...rest } = options;
        super(rest);
        this.token = normalizeToken(token);
        this.type = type || 'Bearer';
        this.storage = storage;
        this.onUnauthorized = typeof onUnauthorized === 'function' ? onUnauthorized : null;
        this.unauthorizedNotified = false;
        this.hydrated = this.token != null || storage == null;
        this.epoch = 0;
        this.hydrating = null;
        // RequestDataMiddleware and QueryMiddleware rebuild the request at
        // priority 50. Run after them so the header survives that rebuild.
        this.options = {
            ...this.options,
            priority: {
                request: priority?.request ?? 60,
                response: priority?.response ?? this.options?.priority?.response ?? 50,
                error: priority?.error ?? this.options?.priority?.error ?? 50,
            },
        };
    }

    setOnUnauthorized(handler) {
        this.onUnauthorized = typeof handler === 'function' ? handler : null;
        return this;
    }

    async setToken(token, type = 'Bearer') {
        this.type = type || 'Bearer';
        return this.commit(normalizeToken(token));
    }

    async clearToken() {
        return this.commit(null);
    }

    async request(request) {
        if (request?.authorization === false) {
            request.headers.delete('Authorization');
            return request;
        }

        const token = await this.currentToken();
        if (token) {
            request.headers.authorization(this.type, token);
        }
        return request;
    }

    async error(error, client) {
        if (error?.status !== 401) return error;

        const request = error.request;
        if (request?.authorization === false) return error;
        if (!request?.headers?.get?.('Authorization')) return error;
        if (this.unauthorizedNotified) return error;

        this.unauthorizedNotified = true;
        if (this.onUnauthorized) {
            await this.onUnauthorized(error, client);
        }
        return error;
    }

    async currentToken() {
        if (this.hydrated) return this.token;
        if (!this.storage) return this.token;

        const epoch = this.epoch;
        if (!this.hydrating) {
            let pending;
            pending = Promise.resolve()
                .then(() => this.storage.get())
                .finally(() => {
                    if (this.hydrating === pending) this.hydrating = null;
                });
            this.hydrating = pending;
        }

        let stored;
        try {
            stored = await this.hydrating;
        } catch (error) {
            if (epoch === this.epoch) this.hydrated = true;
            throw error;
        }

        if (epoch !== this.epoch) return this.token;
        this.hydrated = true;
        if (this.token == null && typeof stored === 'string') {
            const normalized = normalizeToken(stored);
            if (normalized) this.token = normalized;
        }
        return this.token;
    }

    async commit(token) {
        this.epoch += 1;
        this.token = token;
        this.hydrated = true;
        if (token) this.unauthorizedNotified = false;
        if (!this.storage) return this;
        if (token) await this.storage.set(token);
        else await this.storage.clear();
        return this;
    }
}

function normalizeToken(token) {
    if (token == null) return null;
    if (typeof token !== 'string') {
        throw new TypeError('token must be a string');
    }
    const value = token.trim();
    return value === '' ? null : value;
}
