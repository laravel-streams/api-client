/**
 * Tests for Middleware classes
 */

import { describe, it } from 'node:test';
import {
    Middleware,
    AuthorizationMiddleware,
    CriteriaMiddleware,
    OrganizationMiddleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware
} from '../src/index.js';
import { Client } from '../src/index.js';
import { Criteria } from '../src/index.js';
import { FetchRequest } from '../src/index.js';
import assert from 'assert';

describe('Middleware', () => {
    describe('Base Middleware', () => {
        it('should have default options', () => {
            const middleware = new Middleware();
            assert.ok(middleware.options);
            assert.ok(middleware.options.priority);
        });

        it('should merge options', () => {
            const middleware = new Middleware({ priority: { request: 10 } });
            assert.strictEqual(middleware.options.priority.request, 10);
        });
    });

    describe('AuthorizationMiddleware', () => {
        it('should create with token', () => {
            const auth = new AuthorizationMiddleware({
                token: 'test-token',
                type: 'Bearer'
            });
            
            assert.strictEqual(auth.token, 'test-token');
            assert.strictEqual(auth.type, 'Bearer');
        });

        it('should have setToken method', () => {
            const auth = new AuthorizationMiddleware();
            auth.setToken('new-token', 'Basic');
            
            assert.strictEqual(auth.token, 'new-token');
            assert.strictEqual(auth.type, 'Basic');
        });
    });

    describe('OrganizationMiddleware', () => {
        it('should create with an organization id and request priority after the defaults', () => {
            const middleware = new OrganizationMiddleware({
                organizationId: 'org-1'
            });

            const sharedPriority = new Middleware().options.priority.request;

            assert.strictEqual(middleware.organizationId, 'org-1');
            assert.strictEqual(middleware.options.priority.request, 60);
            assert.strictEqual(new Middleware().options.priority.request, sharedPriority);
        });

        it('should set X-Organization-ID from the configured id', async () => {
            const middleware = new OrganizationMiddleware({ organizationId: 'org-1' });
            const request = new FetchRequest('https://example.test/entries');

            const result = await middleware.request(request, {});

            assert.strictEqual(result.headers.get('X-Organization-ID'), 'org-1');
        });

        it('should stringify numeric organization ids', async () => {
            const middleware = new OrganizationMiddleware({ organizationId: 42 });
            const request = new FetchRequest('https://example.test/entries');

            const result = await middleware.request(request, {});

            assert.strictEqual(result.headers.get('X-Organization-ID'), '42');
        });

        it('should use a per-request organization override', async () => {
            const middleware = new OrganizationMiddleware({ organizationId: 'org-1' });
            const request = new FetchRequest('https://example.test/entries', {
                organization: 'org-2'
            });

            const result = await middleware.request(request, {});

            assert.strictEqual(result.headers.get('X-Organization-ID'), 'org-2');
        });

        it('should opt out of one request and remove a pre-set header', async () => {
            const middleware = new OrganizationMiddleware({ organizationId: 'org-1' });
            const request = new FetchRequest('https://example.test/organizations', {
                organization: false,
                headers: { 'X-Organization-ID': 'org-1' }
            });

            const result = await middleware.request(request, {});

            assert.strictEqual(result.headers.get('X-Organization-ID'), null);
        });

        it('should treat null and empty string as opt-out', async () => {
            const middleware = new OrganizationMiddleware({ organizationId: 'org-1' });

            for (const organization of [null, '']) {
                const request = new FetchRequest('https://example.test/organizations', {
                    organization,
                    headers: { 'X-Organization-ID': 'org-1' }
                });
                const result = await middleware.request(request, {});
                assert.strictEqual(result.headers.get('X-Organization-ID'), null);
            }
        });

        it('should leave the header unset when no organization is configured', async () => {
            const middleware = new OrganizationMiddleware();
            const request = new FetchRequest('https://example.test/entries', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            const result = await middleware.request(request, {});

            assert.strictEqual(result.headers.get('X-Organization-ID'), null);
            assert.strictEqual(result.headers.get('X-Requested-With'), 'XMLHttpRequest');
        });

        it('should fall back to client.options.organizationId', async () => {
            const middleware = new OrganizationMiddleware();
            const request = new FetchRequest('https://example.test/entries');

            const result = await middleware.request(request, {
                options: { organizationId: 'from-client' }
            });

            assert.strictEqual(result.headers.get('X-Organization-ID'), 'from-client');
        });

        it('should let a request opt-out win over the client id', async () => {
            const middleware = new OrganizationMiddleware();
            const request = new FetchRequest('https://example.test/organizations', {
                organization: false
            });

            const result = await middleware.request(request, {
                options: { organizationId: 'from-client' }
            });

            assert.strictEqual(result.headers.get('X-Organization-ID'), null);
        });

        it('should update the id with setOrganization and clear it with null', async () => {
            const middleware = new OrganizationMiddleware({ organizationId: 'org-1' });
            middleware.setOrganization('org-3');

            let result = await middleware.request(new FetchRequest('https://example.test/entries'), {});
            assert.strictEqual(result.headers.get('X-Organization-ID'), 'org-3');

            middleware.setOrganization(null);
            result = await middleware.request(new FetchRequest('https://example.test/entries'), {});
            assert.strictEqual(result.headers.get('X-Organization-ID'), null);
        });

        it('should keep the organization flag when request middleware rebuilds the request', () => {
            const original = new FetchRequest('https://example.test/entries', {
                method: 'POST',
                organization: false,
                data: { name: 'A' },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const rebuilt = new FetchRequest(original, {
                body: JSON.stringify(original.data)
            });
            const rewrapped = new FetchRequest(original, {
                method: 'POST'
            });

            assert.strictEqual(rebuilt.organization, false);
            assert.strictEqual(rewrapped.organization, false);
        });

        it('should send the header through the client and keep opt-out off later requests', async () => {
            const calls = [];
            const originalFetch = globalThis.fetch;
            globalThis.fetch = async (url, options) => {
                calls.push({
                    url: String(url),
                    organization: options.headers.get('X-Organization-ID')
                });
                return new Response(JSON.stringify({ data: [] }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            };

            try {
                const client = new Client({
                    baseURL: 'https://example.test',
                    middlewares: [
                        new OrganizationMiddleware({ organizationId: 'org-1' })
                    ]
                });

                await client.get('/entries');
                await client.get('/organizations', { organization: false });
                await client.get('/entries', {
                    query: { status: 'published' },
                    organization: 'org-2'
                });
                await client.get('/entries');

                const writing = new Client({
                    baseURL: 'https://example.test',
                    middlewares: [
                        new OrganizationMiddleware({ organizationId: 'org-1' })
                    ]
                });
                await writing.post('/entries', {
                    data: { name: 'A' },
                    organization: 'org-9'
                });
            } finally {
                globalThis.fetch = originalFetch;
            }

            assert.strictEqual(calls.length, 5);
            assert.strictEqual(calls[0].organization, 'org-1');
            assert.strictEqual(calls[1].organization, null);
            assert.strictEqual(calls[2].organization, 'org-2');
            assert.ok(calls[2].url.includes('status=published'));
            assert.strictEqual(calls[3].organization, 'org-1');
            assert.strictEqual(calls[4].organization, 'org-9');
        });
    });

    describe('CriteriaMiddleware', () => {
        it('should have request method', () => {
            const middleware = new CriteriaMiddleware();
            assert.strictEqual(typeof middleware.request, 'function');
        });

        it('should have correct priority', () => {
            const middleware = new CriteriaMiddleware();
            assert.strictEqual(middleware.options.priority.request, 40);
        });
    });

    describe('QueryMiddleware', () => {
        it('should have request method', () => {
            const middleware = new QueryMiddleware();
            assert.strictEqual(typeof middleware.request, 'function');
        });

        it('should have stringify options', () => {
            const middleware = new QueryMiddleware();
            assert.ok(middleware.options.stringify);
        });
    });

    describe('RequestDataMiddleware', () => {
        it('should have request method', () => {
            const middleware = new RequestDataMiddleware();
            assert.strictEqual(typeof middleware.request, 'function');
        });
    });

    describe('ResponseDataMiddleware', () => {
        it('should have response method', () => {
            const middleware = new ResponseDataMiddleware();
            assert.strictEqual(typeof middleware.response, 'function');
        });
    });

    describe('Middleware.get()', () => {
        it('should filter middlewares with request method', () => {
            const m1 = new class extends Middleware {
                async request(r) { return r; }
            }();

            const m2 = new class extends Middleware {
                async response(r) { return r; }
            }();

            const m3 = new class extends Middleware {
                async request(r) { return r; }
            }();

            const middlewares = [m1, m2, m3];
            const filtered = Middleware.get(middlewares, 'request');

            // Should only include m1 and m3 (those with request method)
            assert.strictEqual(filtered.length, 2);
            assert.ok(typeof filtered[0].request === 'function');
            assert.ok(typeof filtered[1].request === 'function');
        });
    });
});
