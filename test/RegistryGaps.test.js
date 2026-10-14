import { it } from 'node:test';
import assert from 'node:assert/strict';
import { Client, Criteria, ETagMiddleware, Middleware } from '../src/index.js';

function mockFetch(t, handler) {
    t.mock.method(globalThis, 'fetch', handler);
    return new Client({ baseURL: 'https://example.test/api' });
}

const json = (data, init = {}) => new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...init.headers }, ...init,
});

it('criteria preserves filters and orders in API bracket parameters', () => {
    const criteria = new Criteria().where('status', 'published')
        .where('price', '>=', 10).where('price', '<=', 100)
        .orderBy('price', 'asc').orderBy('title', 'desc').limit(10);
    assert.deepEqual(criteria.standardizeParameters(), {
        where: { status: 'published', price: { '>=': 10, '<=': 100 } },
        order_by: { price: 'asc', title: 'desc' }, limit: 10,
    });
});

it('introduction defaults send encoded API criteria and unwrap the envelope', async t => {
    const client = mockFetch(t, async url => {
        const query = new URL(url).searchParams;
        assert.equal(query.get('where[title]'), 'A&B + café');
        assert.equal(query.get('where[views][>]'), '100');
        assert.equal(query.get('order_by[title]'), 'asc');
        return json({ data: [{ id: 1 }], meta: { total: 1 }, links: {}, errors: [] });
    });
    const response = await client.entries.get('posts', { criteria: new Criteria()
        .where('title', 'A&B + café').where('views', '>', 100).orderBy('title', 'asc') });
    assert.deepEqual(response.data, [{ id: 1 }]);
    assert.equal(response.meta.total, 1);
});

it('entries CRUD exposes data and parsed API 409 validation errors', async t => {
    const client = mockFetch(t, async (url, options) => {
        if (options.method === 'POST') return json({ data: null, errors: ['Title required'] }, { status: 409 });
        return json({ data: { id: 1, title: 'Hello' }, errors: [] });
    });
    assert.equal((await client.entries.find('posts', 1)).data.title, 'Hello');
    await assert.rejects(client.entries.post('posts', {}), error => {
        assert.equal(error.status, 409);
        assert.deepEqual(error.response.errors, ['Title required']);
        return true;
    });
});

it('examples middleware hooks operate on unwrapped entries', async t => {
    const client = mockFetch(t, async () => json({ data: [{ id: 1 }], errors: [] }));
    class Observer extends Middleware {
        async response(response) {
            assert.ok(Array.isArray(response.data));
            response.data[0].observed = true;
            return response;
        }
    }
    const observer = new Observer();
    client.use(observer);
    assert.ok(client.middlewares.includes(observer));
    assert.equal((await client.entries.get('posts')).data[0].observed, true);
});

it('quickstart lists arrays and accepts empty delete responses', async t => {
    const client = mockFetch(t, async (url, options) => options.method === 'DELETE'
        ? new Response(null, { status: 204 }) : json({ data: [{ id: 1 }], errors: [] }));
    assert.deepEqual((await client.entries.get('posts')).data.map(entry => entry.id), [1]);
    assert.equal((await client.entries.delete('posts', 1)).data, null);
});

it('streams create patch and put send documented payloads to individual endpoints', async t => {
    const calls = [];
    const client = mockFetch(t, async (url, options) => {
        calls.push([url, options.method, JSON.parse(await new Response(options.body).text()), options.headers.get('X-Custom')]);
        assert.equal(options.headers.get('Content-Type'), 'application/json');
        return json({ data: { id: 'posts' }, errors: [] });
    });
    await client.streams.post({ id: 'posts' }, { headers: { 'X-Custom': 'create' } });
    await client.streams.patch('posts', { name: 'Posts' });
    await client.streams.put('posts', { name: 'All posts' });
    assert.deepEqual(calls, [
        ['https://example.test/api/streams', 'POST', { id: 'posts' }, 'create'],
        ['https://example.test/api/streams/posts', 'PATCH', { name: 'Posts' }, null],
        ['https://example.test/api/streams/posts', 'PUT', { name: 'All posts' }, null],
    ]);
});

it('middleware stores ETags sends conditional requests and replays 304 data', async t => {
    let count = 0;
    const client = mockFetch(t, async (url, options) => {
        count++;
        if (count === 1) return json({ data: [{ id: 1 }], meta: { total: 1 }, errors: [] }, { headers: { ETag: '"v1"' } });
        assert.equal(options.headers.get('If-None-Match'), '"v1"');
        return new Response(null, { status: 304 });
    });
    client.use(new ETagMiddleware());
    const first = await client.entries.get('posts');
    first.data[0].id = 99;
    const second = await client.entries.get('posts');
    assert.deepEqual(second.data, [{ id: 1 }]);
    assert.equal(second.meta.total, 1);
    assert.equal(second.request.response.status, 200);
    assert.equal(second.revalidated, true);
});
