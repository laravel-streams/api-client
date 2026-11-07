import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client, Endpoint, Middleware, Resource } from '../src/index.js';

const makeClient = (options = {}) => new Client({ baseURL: 'https://streams.test/api', ...options });
const json = (data = { ok: true }, status = 200, headers = {}) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });

describe('Endpoint registry', () => {
    it('stores a definition with register and resolves it with endpoint', t => {
        const client = makeClient();
        const returned = client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        assert.equal(returned, client, 'register is chainable');
        assert.ok(client.endpoints.has('groups.members'));

        const endpoint = client.endpoint('groups.members');
        assert.ok(endpoint instanceof Endpoint);
        assert.ok(endpoint instanceof Resource);
        assert.equal(endpoint.client, client);
        assert.equal(endpoint.name, 'groups.members');
        assert.equal(endpoint.method, 'get');
        assert.equal(endpoint.uri, '/groups/{group}/members');
    });

    it('substitutes path params and routes the call through Client.request', async t => {
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            assert.equal(url, 'https://streams.test/api/groups/1/members');
            assert.equal(options.method, 'GET');
            return json({ members: [{ id: 1 }] });
        });
        const client = makeClient();
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        const response = await client.endpoint('groups.members').call({ group: 1 });
        assert.deepEqual(response.data, { members: [{ id: 1 }] });
    });

    it('supports multiple path params and encodes values', async t => {
        const urls = [];
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            urls.push(url);
            return json();
        });
        const client = makeClient();
        client.register('group.member.notes', { method: 'get', uri: '/groups/{group}/members/{member}/notes' });
        await client.endpoint('group.member.notes').get({ group: 'a/b', member: 42 });
        assert.equal(urls[0], 'https://streams.test/api/groups/a%2Fb/members/42/notes');
    });

    it('accepts path params from config.params', async t => {
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            assert.equal(url, 'https://streams.test/api/groups/9/members');
            return json();
        });
        const client = makeClient();
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        await client.endpoint('groups.members').call({}, { params: { group: 9 } });
    });

    it('lets verb methods issue the request with the registered URI', async t => {
        const calls = [];
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            calls.push({ url, method: options.method, body: options.body ? await new Response(options.body).text() : null });
            return json();
        });
        const client = makeClient();
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        const members = client.endpoint('groups.members');

        await members.get({ group: 1 });
        await members.post({ group: 1 }, { data: { name: 'Ada' } });
        await members.delete({ group: 1 });

        assert.deepEqual(calls.map(c => [c.method, c.url]), [
            ['GET', 'https://streams.test/api/groups/1/members'],
            ['POST', 'https://streams.test/api/groups/1/members'],
            ['DELETE', 'https://streams.test/api/groups/1/members'],
        ]);
        assert.equal(calls[1].body, '{"name":"Ada"}');
    });

    it('carries query parameters through the registry call', async t => {
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            assert.equal(url, 'https://streams.test/api/groups/1/members?page=2');
            return json();
        });
        const client = makeClient();
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        await client.endpoint('groups.members').call({ group: 1 }, { query: { page: 2 } });
    });

    it('re-registering a name replaces the previous definition', async t => {
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            assert.equal(url, 'https://streams.test/api/people');
            return json();
        });
        const client = makeClient();
        client.register('people', { method: 'get', uri: '/users' });
        client.register('people', { method: 'get', uri: '/people' });
        await client.endpoint('people').call();
    });

    it('throws a clear error naming an unregistered endpoint', () => {
        const client = makeClient();
        assert.throws(() => client.endpoint('groups.members'), /groups\.members/);
        assert.throws(() => client.endpoint('groups.members'), /register/);
        assert.throws(() => client.endpoint('nope'), /nope/);
    });

    it('validates register arguments', () => {
        const client = makeClient();
        assert.throws(() => client.register('', { method: 'get', uri: '/x' }), /non-empty string/);
        assert.throws(() => client.register('x'), /object with a method and uri/);
        assert.throws(() => client.register('x', { method: 'get' }), /method and a uri string/);
        assert.throws(() => client.register('x', { uri: '/x' }), /method and a uri string/);
    });

    it('throws a clear error when a path parameter is missing', async t => {
        t.mock.method(globalThis, 'fetch', async () => json());
        const client = makeClient();
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        await assert.rejects(client.endpoint('groups.members').call({}), /Missing path parameter "group"/);
        await assert.rejects(client.endpoint('groups.members').call({}, { params: { other: 1 } }), /"group"/);
    });

    it('runs the registered endpoint through the middleware stack', async t => {
        const seen = [];
        const middleware = new class extends Middleware {
            async request(request) {
                seen.push(`request:${request.url}`);
                request.headers.set('X-Endpoint', 'yes');
                return request;
            }
            async response(response) {
                seen.push(`response:${response.status}`);
                return response;
            }
        }();
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            assert.equal(options.headers.get('X-Endpoint'), 'yes');
            return json({ ok: true });
        });
        const client = makeClient({ middlewares: [middleware] });
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        const response = await client.endpoint('groups.members').call({ group: 1 });
        assert.deepEqual(response.data, { ok: true });
        assert.ok(seen.some(s => s.startsWith('request:')));
        assert.ok(seen.some(s => s.startsWith('response:')));
    });

    it('applies the request policy: retries, timeout and abort', async t => {
        let attempts = 0;
        t.mock.method(globalThis, 'fetch', async () => ++attempts === 1 ? json({}, 503) : json({ attempts }));
        const client = makeClient();
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        const response = await client.endpoint('groups.members').call({ group: 1 }, { retries: 1, retryDelay: 0 });
        assert.equal(attempts, 2);
        assert.deepEqual(response.data, { attempts: 2 });
    });

    it('applies the request policy: timeout aborts the fetch', async t => {
        t.mock.method(globalThis, 'fetch', async () => new Promise(() => {}));
        const client = makeClient();
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        await assert.rejects(
            client.endpoint('groups.members').call({ group: 1 }, { timeout: 20, retries: 2 }),
            { name: 'TimeoutError' }
        );
    });

    it('applies the request policy: a caller abort signal propagates', async t => {
        const controller = new AbortController();
        controller.abort();
        const client = makeClient();
        client.register('groups.members', { method: 'get', uri: '/groups/{group}/members' });
        await assert.rejects(
            client.endpoint('groups.members').call({ group: 1 }, { signal: controller.signal }),
            { name: 'AbortError' }
        );
    });
});
