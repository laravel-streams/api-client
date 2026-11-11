import { Middleware } from './Middleware.js';

/**
 * Same-origin Laravel CSRF. Uses the csrf-token meta (X-CSRF-TOKEN) or the
 * XSRF-TOKEN cookie (X-XSRF-TOKEN) on requests that are not GET/HEAD.
 */
export class CsrfMiddleware extends Middleware {
    async request(request) {
        const method = (request.method || 'GET').toUpperCase();
        if (method === 'GET' || method === 'HEAD') {
            return request;
        }

        const meta = this.metaToken();
        if (meta) {
            request.headers.set('X-CSRF-TOKEN', meta);
            return request;
        }

        const cookie = this.cookieToken();
        if (cookie) {
            request.headers.set('X-XSRF-TOKEN', cookie);
        }

        return request;
    }

    metaToken() {
        if (typeof document === 'undefined') {
            return null;
        }

        const meta = document.querySelector('meta[name="csrf-token"]');
        if (meta?.content) {
            return meta.content;
        }

        return null;
    }

    cookieToken() {
        if (typeof document === 'undefined' || ! document.cookie) {
            return null;
        }

        const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
        if (! match) {
            return null;
        }

        return decodeURIComponent(match[1]);
    }
}
