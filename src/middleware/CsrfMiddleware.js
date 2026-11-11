import { Middleware } from './Middleware.js';

/**
 * Same-origin Laravel CSRF. Reads the meta tag or the XSRF-TOKEN cookie
 * and sets X-XSRF-TOKEN on requests that are not GET/HEAD.
 */
export class CsrfMiddleware extends Middleware {
    async request(request) {
        const method = (request.method || 'GET').toUpperCase();
        if (method === 'GET' || method === 'HEAD') {
            return request;
        }

        const token = this.token();
        if (token) {
            request.headers.set('X-XSRF-TOKEN', token);
        }

        return request;
    }

    token() {
        if (typeof document !== 'undefined') {
            const meta = document.querySelector('meta[name="csrf-token"]');
            if (meta && meta.content) {
                return meta.content;
            }
        }

        if (typeof document !== 'undefined' && document.cookie) {
            const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
            if (match) {
                return decodeURIComponent(match[1]);
            }
        }

        return null;
    }
}
