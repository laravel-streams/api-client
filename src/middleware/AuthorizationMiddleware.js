import { Middleware } from './Middleware.js';

/**
 * Middleware to handle authorization headers
 */
export class AuthorizationMiddleware extends Middleware {
    constructor(options = {}) {
        super(options);
        this.token = options.token || null;
        this.type = options.type || 'Bearer';
    }

    async request(request, client) {
        if (this.token) {
            request.headers.authorization(this.type, this.token);
        }
        return request;
    }

    setToken(token, type = 'Bearer') {
        this.token = token;
        this.type = type;
        return this;
    }
}
