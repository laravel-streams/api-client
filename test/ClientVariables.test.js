/**
 * Client configuration page: stream write signatures and ETag caching.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client, ETagMiddleware } from '../src/index.js';

function json(data, init = {}) {
    const headers = { 'Content-Type': 'application/json', ...(init.headers || {}) };
    return new Response(JSON.stringify(data), { ...init, headers });
}

describe('client variables', () => {
    it('streams post patch and put send documented payloads to individual endpoints', async (t) => {
        const calls = [];
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            calls.push({
                url,
                method: options.method,
                body: JSON.parse(await new Response(options.body).text()),
                contentType: options.headers.get('Content-Type'),
                custom: options.headers.get('X-Custom'),
                requestedWith: options.headers.get('X-Requested-With'),
            });
            return json({ id: 'posts' });
        });

        const client = new Client({ baseURL: 'https://example.test/api' });
        await client.streams.post({ id: 'posts' }, { headers: { 'X-Custom': 'create' } });
        await client.streams.patch('posts', { name: 'Posts' });
        await client.streams.put('posts', { name: 'All posts' });

        assert.deepEqual(calls, [
            {
                url: 'https://example.test/api/streams',
                method: 'POST',
                body: { id: 'posts' },
                contentType: 'application/json',
                custom: 'create',
                requestedWith: 'XMLHttpRequest',
            },
            {
                url: 'https://example.test/api/streams/posts',
                method: 'PATCH',
                body: { name: 'Posts' },
                contentType: 'application/json',
                custom: null,
                requestedWith: 'XMLHttpRequest',
            },
            {
                url: 'https://example.test/api/streams/posts',
                method: 'PUT',
                body: { name: 'All posts' },
                contentType: 'application/json',
                custom: null,
                requestedWith: 'XMLHttpRequest',
            },
        ]);
        assert.equal(client.options.request.method, undefined);
        assert.equal(client.options.request.data, undefined);
        assert.equal(client.options.request.headers['X-Custom'], undefined);
    });

    it('ETag middleware stores validators sends If-None-Match and replays 304 data', async (t) => {
        let count = 0;
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            count += 1;
            if (count === 1) {
                return json({ id: 1, title: 'Cached' }, { headers: { ETag: '"v1"' } });
            }
            assert.equal(options.headers.get('If-None-Match'), '"v1"');
            return new Response(null, { status: 304, headers: { ETag: '"v1"' } });
        });

        const client = new Client({
            baseURL: 'https://example.test/api',
            middlewares: [new ETagMiddleware()],
        });
        const first = await client.get('/posts/1');
        first.data.title = 'mutated';
        const second = await client.get('/posts/1');

        assert.deepEqual(second.data, { id: 1, title: 'Cached' });
        assert.equal(second.revalidated, true);
        assert.equal(count, 2);
    });

    it('ETag cache stays isolated by authorization and clears after stream writes', async (t) => {
        const conditional = [];
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            conditional.push(options.headers.get('If-None-Match'));
            if (options.method === 'PATCH') {
                return json({ name: 'Posts' });
            }
            return json({ id: 'posts' }, { headers: { ETag: '"v1"' } });
        });

        const client = new Client({
            baseURL: 'https://example.test/api',
            middlewares: [new ETagMiddleware()],
        });
        await client.streams.find('posts', { headers: { Authorization: 'Bearer first' } });
        await client.streams.find('posts', { headers: { Authorization: 'Bearer second' } });
        await client.streams.patch('posts', { name: 'Posts' });
        await client.streams.find('posts', { headers: { Authorization: 'Bearer first' } });

        assert.deepEqual(conditional, [null, null, null, null]);
    });

    it('ETag revalidation updates validators and honors no-store response metadata', async (t) => {
        let count = 0;
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            count += 1;
            if (count === 1) {
                return json({ id: 1 }, { headers: { ETag: '"v1"' } });
            }
            if (count === 2) {
                assert.equal(options.headers.get('If-None-Match'), '"v1"');
                return new Response(null, { status: 304, headers: { ETag: '"v2"' } });
            }
            if (count === 3) {
                assert.equal(options.headers.get('If-None-Match'), '"v2"');
                return new Response(null, { status: 304, headers: { 'Cache-Control': 'no-store' } });
            }
            assert.equal(options.headers.get('If-None-Match'), null);
            return json({ id: 2 });
        });

        const client = new Client({
            baseURL: 'https://example.test/api',
            middlewares: [new ETagMiddleware()],
        });
        await client.get('/posts/1');
        const updated = await client.get('/posts/1');
        assert.deepEqual(updated.data, { id: 1 });
        assert.equal(updated.headers.get('ETag'), '"v2"');
        assert.deepEqual((await client.get('/posts/1')).data, { id: 1 });
        assert.deepEqual((await client.get('/posts/1')).data, { id: 2 });
    });
});
