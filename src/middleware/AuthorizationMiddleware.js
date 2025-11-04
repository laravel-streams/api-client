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
            console.log('AuthorizationMiddleware: Setting token', this.type, this.token);
            request.headers.authorization(this.type, this.token);
            console.log('AuthorizationMiddleware: Header set, checking...', request.headers.get('Authorization'));
        }
        return request;
    }

    setToken(token, type = 'Bearer') {
        this.token = token;
        this.type = type;
        return this;
    }
}
