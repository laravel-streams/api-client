import { AuthorizationMiddleware } from './middleware/AuthorizationMiddleware.js';

/**
 * Session helpers for the Streams identity API.
 *
 * Canonical sign-in follows ADR-007: a magic link is the default, and a
 * password is the fallback. `claim` / `requestMagicLink` posts the email to
 * `auth/magic-link`. `activate` / `consumeMagicLink` posts the single-use
 * link token to `auth/magic-link/consume` and stores the session token from
 * the response. There is no 6-digit code helper. `register/verify-otp`,
 * `register/resend-otp`, and `register/complete` are retired and are not called.
 *
 * Logged-out calls send neither Authorization nor X-Organization-ID.
 * Organization discovery (`organizations`) sends the session and opts out of
 * the organization header. Paths are relative to the client base URL, which
 * already includes `/api`.
 */
export class Auth {
    static defaultPaths = {
        login: 'auth/login',
        logout: 'auth/logout',
        revokeAll: 'auth/revoke-all',
        me: 'auth/me',
        organizations: 'auth/organizations',
        magicLink: 'auth/magic-link',
        consume: 'auth/magic-link/consume',
    };

    constructor(client, options = {}) {
        if (!client || typeof client.post !== 'function' || typeof client.get !== 'function') {
            throw new TypeError('Auth requires a Client');
        }
        this.client = client;
        this.authorization = options.authorization
            ?? client.middlewares?.find((middleware) => middleware instanceof AuthorizationMiddleware)
            ?? null;
        this.paths = { ...Auth.defaultPaths, ...options.paths };
        this.deviceName = options.deviceName ?? 'streams-api-client';
    }

    async login({ email, password, deviceName } = {}) {
        requireText(email, 'email');
        requireText(password, 'password');
        const response = await this.client.post(this.paths.login, {
            data: {
                email,
                password,
                device_name: deviceName ?? this.deviceName,
            },
            ...loggedOut,
        });
        assertEnvelope(response);
        await this.storeSession(response);
        return response;
    }

    /**
     * Ask the server to send a magic link. This is the claim step.
     */
    async requestMagicLink({ email } = {}) {
        requireText(email, 'email');
        const response = await this.client.post(this.paths.magicLink, {
            data: { email },
            ...loggedOut,
        });
        assertEnvelope(response);
        return response;
    }

    claim(input) {
        return this.requestMagicLink(input);
    }

    /**
     * Exchange the single-use link token for a session. This is the activate step.
     * The argument is the link token, not the session token returned by the server.
     */
    async consumeMagicLink({ token } = {}) {
        requireText(token, 'token');
        const response = await this.client.post(this.paths.consume, {
            data: { token },
            ...loggedOut,
        });
        assertEnvelope(response);
        await this.storeSession(response);
        return response;
    }

    activate(input) {
        return this.consumeMagicLink(input);
    }

    async logout() {
        try {
            return await this.client.post(this.paths.logout, { data: {} });
        } finally {
            if (this.authorization) await this.authorization.clearToken();
        }
    }

    async revokeAll() {
        try {
            return await this.client.post(this.paths.revokeAll, { data: {} });
        } finally {
            if (this.authorization) await this.authorization.clearToken();
        }
    }

    /**
     * Current identity. Pass `{ organization: false }` before an organization is selected.
     */
    me(config = {}) {
        return this.client.get(this.paths.me, config);
    }

    /**
     * Organizations for the signed-in identity. No tenant header.
     */
    organizations() {
        return this.client.get(this.paths.organizations, { organization: false });
    }

    async storeSession(response) {
        const token = readSessionToken(response);
        if (token && this.authorization) await this.authorization.setToken(token);
        return token;
    }
}

const loggedOut = { organization: false, authorization: false };

function requireText(value, name) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new TypeError(`${name} is required`);
    }
}

function assertEnvelope(response) {
    const errors = response?.data?.errors;
    if (!Array.isArray(errors) || errors.length === 0) return response;
    const first = errors[0];
    const message = typeof first === 'string' ? first : (first?.message || 'Request failed');
    const error = new Error(message);
    error.response = response;
    throw error;
}

function readSessionToken(response) {
    const body = response?.data;
    if (!body || typeof body !== 'object') return null;
    if (typeof body.token === 'string' && body.token.trim() !== '') return body.token.trim();
    if (typeof body.data?.token === 'string' && body.data.token.trim() !== '') return body.data.token.trim();
    return null;
}
