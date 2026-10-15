import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import {
    Auth,
    AuthorizationMiddleware,
    Client,
    FetchError,
    FetchRequest,
    MemoryTokenStorage,
    Middleware,
    OrganizationMiddleware,
    WebStorageTokenStorage,
    createTokenStorage,
    secureStorageAdapter,
} from '../src/index.js';

const json = (data, status = 200) => new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
});

const makeClient = (middlewares, baseURL = 'https://streams.test/api') => new Client({
    baseURL,
    middlewares,
});

function memoryStorageShim(initial = {}) {
    const items = new Map(Object.entries(initial));
    return {
        getItem: (key) => items.has(key) ? items.get(key) : null,
        setItem: (key, value) => items.set(key, String(value)),
        removeItem: (key) => items.delete(key),
        items,
    };
}

describe('Token storage', () => {
    it('stores and clears a session in memory', async () => {
        const storage = new MemoryTokenStorage();
        assert.equal(await storage.get(), null);
        await storage.set('session-a');
        assert.equal(await storage.get(), 'session-a');
        await storage.set('  ');
        assert.equal(await storage.get(), null);
        await storage.set('session-b');
        await storage.clear();
        assert.equal(await storage.get(), null);
    });

    it('rejects a non-string token', async () => {
        const storage = new MemoryTokenStorage();
        await assert.rejects(() => storage.set({ token: 'session-a' }), TypeError);
    });

    it('reads and writes Web Storage without keeping a second copy', async () => {
        const shim = memoryStorageShim();
        const storage = new WebStorageTokenStorage(shim, 'session');
        await storage.set('session-a');
        assert.equal(shim.items.get('session'), 'session-a');
        assert.equal(await storage.get(), 'session-a');
        await storage.clear();
        assert.equal(shim.items.has('session'), false);
    });

    it('adapts a secure-storage plugin and treats a missing key as empty', async () => {
        const saved = new Map();
        const plugin = {
            async get({ key }) {
                if (!saved.has(key)) throw new Error('Item not found');
                return { value: saved.get(key) };
            },
            async set({ key, value }) {
                saved.set(key, value);
            },
            async remove({ key }) {
                saved.delete(key);
            },
        };
        const storage = secureStorageAdapter(plugin, 'session');
        assert.equal(await storage.get(), null);
        await storage.set('session-a');
        assert.equal(saved.get('session'), 'session-a');
        assert.equal(await storage.get(), 'session-a');
        await storage.clear();
        assert.equal(await storage.get(), null);
    });

    it('selects an adapter from the source shape', () => {
        const memory = new MemoryTokenStorage('session-a');
        assert.ok(createTokenStorage() instanceof MemoryTokenStorage);
        assert.equal(createTokenStorage(memory), memory);
        assert.ok(createTokenStorage(memoryStorageShim()) instanceof WebStorageTokenStorage);
        assert.equal(typeof createTokenStorage({ get() {}, set() {}, remove() {} }).get, 'function');
        assert.throws(() => createTokenStorage({ get() {} }), TypeError);
    });
});

describe('Authorization lifecycle', () => {
    it('keeps the bearer header off the shared middleware defaults', () => {
        const before = new Middleware().options.priority.request;
        const auth = new AuthorizationMiddleware({ token: 'session-a', storage: new MemoryTokenStorage() });
        assert.equal(auth.options.priority.request, 60);
        assert.equal(auth.token, 'session-a');
        assert.equal(new Middleware().options.priority.request, before);
        assert.equal(new Middleware().options.token, undefined);
    });

    it('does not write the token to the console', async () => {
        const logs = [];
        const original = console.log;
        console.log = (...args) => logs.push(args.join(' '));
        try {
            const auth = new AuthorizationMiddleware({ token: 'session-a' });
            const request = new FetchRequest('https://example.test/entries');
            await auth.request(request);
            assert.equal(request.headers.get('Authorization'), 'Bearer session-a');
            assert.equal(logs.length, 0);
        } finally {
            console.log = original;
        }
    });

    it('loads a stored token once and lets the caller replace it', async () => {
        let reads = 0;
        const storage = {
            async get() {
                reads += 1;
                return 'session-a';
            },
            async set(token) {
                this.value = token;
            },
            async clear() {
                this.value = null;
            },
        };
        const auth = new AuthorizationMiddleware({ storage });
        const first = new FetchRequest('https://example.test/entries');
        const second = new FetchRequest('https://example.test/entries');
        await auth.request(first);
        await auth.request(second);
        assert.equal(first.headers.get('Authorization'), 'Bearer session-a');
        assert.equal(second.headers.get('Authorization'), 'Bearer session-a');
        assert.equal(reads, 1);

        await auth.setToken('session-b', 'Basic');
        assert.equal(storage.value, 'session-b');
        const third = new FetchRequest('https://example.test/entries');
        await auth.request(third);
        assert.equal(third.headers.get('Authorization'), 'Basic session-b');
        assert.equal(reads, 1);
    });

    it('drops the header when a request opts out, including after a rebuild', async () => {
        const auth = new AuthorizationMiddleware({ token: 'session-a' });
        const request = new FetchRequest('https://example.test/auth/login', {
            method: 'POST',
            authorization: false,
            data: { email: 'ada@example.com' },
            headers: { Authorization: 'Bearer session-a' },
        });
        const rebuilt = new FetchRequest(request, { body: '{"email":"ada@example.com"}' });
        assert.equal(rebuilt.authorization, false);
        const result = await auth.request(rebuilt);
        assert.equal(result.headers.get('Authorization'), null);
    });

    it('calls the 401 hook once until the token changes', async () => {
        const calls = [];
        const auth = new AuthorizationMiddleware({
            token: 'session-a',
            onUnauthorized: (error, client) => calls.push({ status: error.status, client }),
        });
        const client = makeClient([auth]);
        const fetch = async () => json({ message: 'Unauthenticated' }, 401);
        const original = globalThis.fetch;
        globalThis.fetch = fetch;
        try {
            await assert.rejects(client.get('entries'), (error) => error instanceof FetchError && error.status === 401);
            await assert.rejects(client.get('entries'), { status: 401 });
            assert.equal(calls.length, 1);
            assert.equal(calls[0].client, client);

            await auth.setToken('session-b');
            await assert.rejects(client.get('entries'), { status: 401 });
            assert.equal(calls.length, 2);
        } finally {
            globalThis.fetch = original;
        }
    });

    it('does not treat a logged-out 401 as an expired session', async () => {
        let calls = 0;
        const auth = new AuthorizationMiddleware({
            token: 'session-a',
            onUnauthorized: () => { calls += 1; },
        });
        const client = makeClient([auth]);
        const original = globalThis.fetch;
        globalThis.fetch = async () => json({ message: 'Unauthenticated' }, 401);
        try {
            await assert.rejects(client.post('auth/login', {
                data: { email: 'ada@example.com', password: 'nope' },
                authorization: false,
            }), { status: 401 });
            assert.equal(calls, 0);
        } finally {
            globalThis.fetch = original;
        }
    });

    it('keeps a stored token when hydration loses a race with clearToken', async () => {
        let release;
        const gate = new Promise((resolve) => { release = resolve; });
        const storage = {
            async get() {
                await gate;
                return 'session-a';
            },
            async set() {},
            async clear() {
                this.cleared = true;
            },
        };
        const auth = new AuthorizationMiddleware({ storage });
        const pending = auth.currentToken();
        const cleared = auth.clearToken();
        release();
        await cleared;
        assert.equal(await pending, null);
        assert.equal(auth.token, null);
        assert.equal(storage.cleared, true);
    });
});

describe('Auth helpers', () => {
    it('claims, activates, and signs in without sending a stale session or organization', async () => {
        const storage = new MemoryTokenStorage('stale-session');
        const authMiddleware = new AuthorizationMiddleware({ storage });
        const seen = [];
        const original = globalThis.fetch;
        globalThis.fetch = async (url, options) => {
            const body = options.body ? await new Response(options.body).text() : '';
            seen.push({
                url: String(url),
                authorization: options.headers.get('Authorization'),
                organization: options.headers.get('X-Organization-ID'),
                body,
            });
            if (String(url).endsWith('/auth/magic-link')) {
                return json({ data: { status: 'link_sent' }, errors: [] });
            }
            if (String(url).endsWith('/auth/magic-link/consume')) {
                return json({
                    data: {
                        token: 'session-a',
                        identity: { id: 1, email: 'ada@example.com', display_name: 'Ada', status: 'active' },
                    },
                    errors: [],
                });
            }
            if (String(url).endsWith('/auth/login')) {
                return json({ data: { token: 'session-b', identity: { id: 2, email: 'bea@example.com' } }, errors: [] });
            }
            return json({ data: {} });
        };
        try {
            const client = makeClient([
                new OrganizationMiddleware({ organizationId: 'org-9' }),
                authMiddleware,
            ]);
            const auth = new Auth(client, { deviceName: 'test-device' });
            const claimed = await auth.claim({ email: 'ada@example.com' });
            assert.equal(claimed.data.data.status, 'link_sent');
            await auth.activate({ token: 'link-a' });
            assert.equal(await storage.get(), 'session-a');
            await auth.login({ email: 'bea@example.com', password: 'correct' });
            assert.equal(await storage.get(), 'session-b');
        } finally {
            globalThis.fetch = original;
        }

        assert.deepEqual(seen.map((call) => call.url), [
            'https://streams.test/api/auth/magic-link',
            'https://streams.test/api/auth/magic-link/consume',
            'https://streams.test/api/auth/login',
        ]);
        for (const call of seen) {
            assert.equal(call.authorization, null);
            assert.equal(call.organization, null);
        }
        assert.equal(seen[0].body, '{"email":"ada@example.com"}');
        assert.equal(seen[1].body, '{"token":"link-a"}');
        assert.equal(seen[2].body, '{"email":"bea@example.com","password":"correct","device_name":"test-device"}');
    });

    it('requires the claim and activate fields', async () => {
        const auth = new Auth(makeClient([]));
        await assert.rejects(() => auth.requestMagicLink({}), TypeError);
        await assert.rejects(() => auth.consumeMagicLink({ token: '  ' }), TypeError);
        await assert.rejects(() => auth.login({ email: 'ada@example.com' }), TypeError);
    });

    it('surfaces an errors envelope without storing a session', async () => {
        const storage = new MemoryTokenStorage();
        const authorization = new AuthorizationMiddleware({ storage });
        const original = globalThis.fetch;
        globalThis.fetch = async () => json({ errors: [{ message: 'No match' }] });
        try {
            const auth = new Auth(makeClient([authorization]));
            await assert.rejects(() => auth.requestMagicLink({ email: 'ada@example.com' }), /No match/);
            assert.equal(await storage.get(), null);
        } finally {
            globalThis.fetch = original;
        }
    });
});

describe('Mock server auth lifecycle', () => {
    it('runs claim, activate, me, a single 401 hook, and logout', async () => {
        const seen = [];
        let rejectEntries = false;
        const server = createServer(async (req, res) => {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString('utf8');
            const body = raw ? JSON.parse(raw) : null;
            seen.push({
                method: req.method,
                url: req.url,
                authorization: req.headers.authorization ?? null,
                organization: req.headers['x-organization-id'] ?? null,
                body,
            });
            const send = (status, payload) => {
                res.writeHead(status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(payload));
            };
            if (req.method === 'POST' && req.url === '/api/auth/magic-link') {
                return send(200, { data: { status: 'link_sent' }, errors: [] });
            }
            if (req.method === 'POST' && req.url === '/api/auth/magic-link/consume') {
                return send(200, {
                    data: { token: 'session-a', identity: { id: 1, email: 'ada@example.com', status: 'active' } },
                    errors: [],
                });
            }
            if (req.method === 'GET' && req.url === '/api/auth/me') {
                if (req.headers.authorization !== 'Bearer session-a') return send(401, { message: 'Unauthenticated' });
                return send(200, { data: { identity: { id: 1, email: 'ada@example.com' } }, errors: [] });
            }
            if (req.method === 'GET' && req.url === '/api/auth/organizations') {
                return send(200, { data: [{ id: 4, name: 'North' }] });
            }
            if (req.method === 'GET' && req.url === '/api/entries') {
                if (rejectEntries || req.headers.authorization !== 'Bearer session-a') {
                    return send(401, { message: 'Unauthenticated' });
                }
                return send(200, { data: [] });
            }
            if (req.method === 'POST' && req.url === '/api/auth/logout') return send(200, { data: { revoked: true } });
            if (req.method === 'POST' && req.url === '/api/auth/revoke-all') return send(500, { message: 'unavailable' });
            if (req.method === 'POST' && req.url === '/api/auth/login') {
                return send(401, { message: 'Unauthenticated' });
            }
            return send(404, { message: 'missing' });
        });

        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
        const { port } = server.address();
        try {
            const storage = new MemoryTokenStorage('stale-session');
            const unauthorized = [];
            const authorization = new AuthorizationMiddleware({
                storage,
                onUnauthorized: (error) => unauthorized.push(error.status),
            });
            const client = new Client({
                baseURL: `http://127.0.0.1:${port}/api`,
                middlewares: [
                    new OrganizationMiddleware({ organizationId: 4 }),
                    authorization,
                ],
            });
            const auth = new Auth(client);

            await auth.claim({ email: 'ada@example.com' });
            await auth.activate({ token: 'link-a' });
            assert.equal(await storage.get(), 'session-a');

            const me = await auth.me();
            assert.equal(me.data.data.identity.email, 'ada@example.com');
            const organizations = await auth.organizations();
            assert.equal(organizations.data.data[0].name, 'North');

            await client.get('entries');
            rejectEntries = true;
            await assert.rejects(client.get('entries'), { status: 401 });
            await assert.rejects(client.get('entries'), { status: 401 });
            assert.deepEqual(unauthorized, [401]);

            await assert.rejects(auth.login({ email: 'ada@example.com', password: 'nope' }), { status: 401 });
            assert.deepEqual(unauthorized, [401]);
            assert.equal(await storage.get(), 'session-a');

            await auth.logout();
            assert.equal(await storage.get(), null);

            await authorization.setToken('session-a');
            await assert.rejects(auth.revokeAll(), (error) => error instanceof FetchError && error.status === 500);
            assert.equal(await storage.get(), null);
        } finally {
            await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
        }

        const claim = seen.find((call) => call.url === '/api/auth/magic-link');
        const activate = seen.find((call) => call.url === '/api/auth/magic-link/consume');
        const me = seen.find((call) => call.url === '/api/auth/me');
        const organizations = seen.find((call) => call.url === '/api/auth/organizations');
        const logout = seen.find((call) => call.url === '/api/auth/logout');
        assert.equal(claim.authorization, null);
        assert.equal(claim.organization, null);
        assert.deepEqual(claim.body, { email: 'ada@example.com' });
        assert.equal(activate.authorization, null);
        assert.deepEqual(activate.body, { token: 'link-a' });
        assert.equal(me.authorization, 'Bearer session-a');
        assert.equal(me.organization, '4');
        assert.equal(organizations.authorization, 'Bearer session-a');
        assert.equal(organizations.organization, null);
        assert.equal(logout.authorization, 'Bearer session-a');
        assert.equal(seen.filter((call) => call.url === '/api/entries' && call.authorization === 'Bearer session-a').length, 3);
    });
});
