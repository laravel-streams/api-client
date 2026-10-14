import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client, FetchError, FetchRequest, Middleware } from '../src/index.js';
import { retryDelay } from '../src/RequestPolicy.js';

const makeClient = (options = {}) => new Client({ baseURL: 'https://streams.test/api', ...options });
const json = (data = { ok: true }, status = 200, headers = {}) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });

describe('Client request policy', () => {
    it('keeps retries opt-in', async t => {
        const fetch = t.mock.method(globalThis, 'fetch', async () => json({}, 503));
        await assert.rejects(makeClient().get('streams'), error => error instanceof FetchError && error.status === 503);
        assert.equal(fetch.mock.callCount(), 1);
    });

    for (const status of [408, 429, 500, 502, 503, 504]) {
        it(`retries HTTP ${status} then parses the successful response`, async t => {
            let attempts = 0;
            t.mock.method(globalThis, 'fetch', async () => ++attempts === 1 ? json({}, status) : json({ attempts }));
            const response = await makeClient().get('streams', { retries: 1, retryDelay: 0 });
            assert.deepEqual(response.data, { attempts: 2 });
        });
    }

    it('bounds attempts and returns the final HTTP error', async t => {
        const fetch = t.mock.method(globalThis, 'fetch', async () => json({}, 503));
        await assert.rejects(makeClient().get('streams', { retries: 2, retryDelay: 0 }), { status: 503 });
        assert.equal(fetch.mock.callCount(), 3);
    });

    it('retries transport failures on safe methods', async t => {
        let attempts = 0;
        t.mock.method(globalThis, 'fetch', async () => {
            if (++attempts < 3) throw new TypeError('Failed to fetch');
            return json({ attempts });
        });
        assert.deepEqual((await makeClient().get('streams', { retries: 2, retryDelay: 0 })).data, { attempts: 3 });
    });

    it('preserves the final transport error on exhaustion', async t => {
        const error = new TypeError('Failed to fetch');
        const fetch = t.mock.method(globalThis, 'fetch', async () => { throw error; });
        await assert.rejects(makeClient().get('streams', { retries: 1, retryDelay: 0 }), e => e === error);
        assert.equal(fetch.mock.callCount(), 2);
    });

    for (const method of ['post', 'patch']) {
        for (const network of [false, true]) {
            it(`does not retry unkeyed ${method.toUpperCase()} on ${network ? 'transport' : 'HTTP'} failure`, async t => {
                const fetch = t.mock.method(globalThis, 'fetch', async () => {
                    if (network) throw new TypeError('Failed to fetch');
                    return json({}, 503);
                });
                await assert.rejects(makeClient()[method]('streams', { retries: 2, retryDelay: 0 }));
                assert.equal(fetch.mock.callCount(), 1);
            });
        }
    }

    for (const method of ['put', 'delete']) {
        it(`retries idempotent ${method.toUpperCase()}`, async t => {
            let attempts = 0;
            t.mock.method(globalThis, 'fetch', async () => ++attempts === 1 ? json({}, 503) : json());
            await makeClient()[method]('streams', { retries: 1, retryDelay: 0 });
            assert.equal(attempts, 2);
        });
    }

    it('replays a keyed JSON mutation with the same body, headers, query, and key', async t => {
        const attempts = [];
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            attempts.push({ url, body: await new Response(options.body).text(), headers: new Headers(options.headers) });
            return attempts.length === 1 ? json({}, 503) : json();
        });
        const config = {
            data: { title: 'Hello' }, query: { page: 2 }, responseType: 'text',
            headers: new Headers({ 'X-Custom': 'value' }), idempotencyKey: 'create-entry-1',
            retries: 1, retryDelay: 0,
        };
        const response = await makeClient().post('streams/posts/entries', config);
        assert.equal(response.data, '{"ok":true}');
        assert.equal(attempts.length, 2);
        for (const attempt of attempts) {
            assert.equal(attempt.url, 'https://streams.test/api/streams/posts/entries?page=2');
            assert.equal(attempt.body, '{"title":"Hello"}');
            assert.equal(attempt.headers.get('Idempotency-Key'), 'create-entry-1');
            assert.equal(attempt.headers.get('X-Custom'), 'value');
            assert.equal(attempt.headers.get('X-Requested-With'), 'XMLHttpRequest');
        }
        assert.equal(config.method, undefined);
        assert.equal(config.headers.get('Idempotency-Key'), null);
    });

    it('accepts an explicit idempotency header for PATCH retries', async t => {
        let attempts = 0;
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            assert.equal(options.headers.get('Idempotency-Key'), 'update-entry-1');
            return ++attempts === 1 ? json({}, 503) : json();
        });
        await makeClient().patch('streams', { headers: { 'Idempotency-Key': 'update-entry-1' }, retries: 1, retryDelay: 0 });
        assert.equal(attempts, 2);
    });

    it('does not retry nontransient HTTP errors', async t => {
        for (const status of [400, 401, 403, 404, 409, 422, 501]) {
            const fetch = t.mock.method(globalThis, 'fetch', async () => json({}, status));
            await assert.rejects(makeClient().get('streams', { retries: 2, retryDelay: 0 }), { status });
            assert.equal(fetch.mock.callCount(), 1);
            fetch.mock.restore();
        }
    });

    it('does not retry response parsing failures', async t => {
        const fetch = t.mock.method(globalThis, 'fetch', async () => new Response('not JSON'));
        await assert.rejects(makeClient().get('streams', { retries: 2, retryDelay: 0 }), SyntaxError);
        assert.equal(fetch.mock.callCount(), 1);
    });

    it('does not retry response middleware failures', async t => {
        const fetch = t.mock.method(globalThis, 'fetch', async () => json());
        const middleware = new class extends Middleware {
            async response() { throw new TypeError('middleware failure'); }
        }();
        await assert.rejects(makeClient({ middlewares: [middleware] }).get('streams', { retries: 2 }), /middleware failure/);
        assert.equal(fetch.mock.callCount(), 1);
    });

    it('uses exponential backoff, Retry-After seconds/date, and the delay cap', () => {
        const policy = { retryDelay: 100, maxRetryDelay: 5000 };
        assert.equal(retryDelay(policy, 0, json()), 100);
        assert.equal(retryDelay(policy, 2, json()), 400);
        assert.equal(retryDelay(policy, 0, json({}, 429, { 'Retry-After': '2' })), 2000);
        assert.equal(retryDelay(policy, 0, json({}, 429, { 'Retry-After': '99999' })), 5000);
        assert.equal(retryDelay(policy, 0, json({}, 429, { 'Retry-After': 'invalid' })), 100);
        const future = new Date(Date.now() + 4000).toUTCString();
        assert.ok(retryDelay(policy, 0, json({}, 503, { 'Retry-After': future })) >= 2900);
        assert.equal(retryDelay(policy, 0, json({}, 503, { 'Retry-After': 'Wed, 01 Jan 2020 00:00:00 GMT' })), 100);
    });

    it('cancels a discarded response body before retrying', async t => {
        let canceled = false;
        let attempts = 0;
        t.mock.method(globalThis, 'fetch', async () => {
            if (++attempts > 1) {
                assert.equal(canceled, true);
                return json();
            }
            return new Response(new ReadableStream({ cancel() { canceled = true; } }), { status: 503 });
        });
        await makeClient().get('streams', { retries: 1, retryDelay: 0 });
    });

    it('keeps request defaults and concurrent overrides isolated', async t => {
        const controller = new AbortController();
        const options = { request: { retries: 1, retryDelay: 0, headers: new Headers({ 'X-Default': 'yes' }) } };
        const client = makeClient(options);
        const attempts = [];
        t.mock.method(globalThis, 'fetch', async (url, config) => {
            attempts.push({ url, headers: new Headers(config.headers), signal: config.signal });
            return json();
        });
        await Promise.all([
            client.post('one', { signal: controller.signal, idempotencyKey: 'one', headers: { 'X-Once': 'yes' } }),
            client.get('two'),
        ]);
        const first = attempts.find(a => a.url.endsWith('/one'));
        const second = attempts.find(a => a.url.endsWith('/two'));
        assert.equal(first.headers.get('X-Once'), 'yes');
        assert.equal(second.headers.get('X-Once'), null);
        assert.equal(second.headers.get('Idempotency-Key'), null);
        assert.equal(client.options.request.signal, undefined);
        assert.equal(client.options.request.idempotencyKey, undefined);
        assert.equal(options.request.headers.get('X-Once'), null);
        assert.notEqual(first.signal, second.signal);
    });

    it('lets per-request retries override defaults without changing subsequent calls', async t => {
        const client = makeClient({ request: { retries: 1, retryDelay: 0 } });
        const fetch = t.mock.method(globalThis, 'fetch', async () => json({}, 503));
        await assert.rejects(client.get('one', { retries: 0 }));
        assert.equal(fetch.mock.callCount(), 1);
        await assert.rejects(client.get('two'));
        assert.equal(fetch.mock.callCount(), 3);
    });

    it('rejects invalid policy options without sending a request', async t => {
        const fetch = t.mock.method(globalThis, 'fetch', async () => json());
        for (const config of [{ retries: -1 }, { retries: 11 }, { retries: 1.5 }, { timeout: -1 },
            { timeout: Infinity }, { retryDelay: NaN }, { maxRetryDelay: 2147483648 },
            { idempotencyKey: '' }, { idempotencyKey: ' ' }, { idempotencyKey: 123 }]) {
            await assert.rejects(makeClient().get('streams', config));
        }
        assert.equal(fetch.mock.callCount(), 0);
    });
});

describe('Abort and timeout', () => {
    it('does not send a pre-aborted request and preserves the abort reason', async t => {
        const controller = new AbortController();
        const reason = new Error('user canceled');
        controller.abort(reason);
        const fetch = t.mock.method(globalThis, 'fetch', async () => json());
        await assert.rejects(makeClient().get('streams', { signal: controller.signal }), e => e === reason);
        assert.equal(fetch.mock.callCount(), 0);
    });

    it('passes a live abort signal through JSON and query middleware', async t => {
        const controller = new AbortController();
        let sentSignal;
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            sentSignal = options.signal;
            controller.abort();
            return new Promise(() => {});
        });
        await assert.rejects(makeClient().post('streams', {
            data: { title: 'test' }, query: { page: 1 }, signal: controller.signal,
        }), { name: 'AbortError' });
        assert.equal(sentSignal.aborted, true);
    });

    it('does not retry abort errors', async t => {
        const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new DOMException('Aborted', 'AbortError'); });
        await assert.rejects(makeClient().get('streams', { retries: 2, retryDelay: 0 }), { name: 'AbortError' });
        assert.equal(fetch.mock.callCount(), 1);
    });

    it('aborts during backoff without another attempt', async t => {
        const controller = new AbortController();
        const fetch = t.mock.method(globalThis, 'fetch', async () => {
            setTimeout(() => controller.abort(), 10);
            return json({}, 503);
        });
        await assert.rejects(makeClient().get('streams', {
            signal: controller.signal, retries: 2, retryDelay: 1000,
        }), { name: 'AbortError' });
        assert.equal(fetch.mock.callCount(), 1);
    });

    it('times out a pending fetch, aborts its signal, and never retries', async t => {
        let signal;
        const fetch = t.mock.method(globalThis, 'fetch', async (url, options) => {
            signal = options.signal;
            return new Promise(() => {});
        });
        await assert.rejects(makeClient().get('streams', { timeout: 20, retries: 2 }), { name: 'TimeoutError' });
        assert.equal(signal.aborted, true);
        assert.equal(fetch.mock.callCount(), 1);
    });

    it('uses one total timeout across retry backoff', async t => {
        const fetch = t.mock.method(globalThis, 'fetch', async () => json({}, 503));
        await assert.rejects(makeClient().get('streams', { timeout: 20, retries: 2, retryDelay: 1000 }), { name: 'TimeoutError' });
        assert.equal(fetch.mock.callCount(), 1);
    });

    it('times out response body parsing', async t => {
        t.mock.method(globalThis, 'fetch', async () => new Response(new ReadableStream()));
        await assert.rejects(makeClient().get('streams', { timeout: 20 }), { name: 'TimeoutError' });
    });

    it('times out request middleware before sending', async t => {
        const middleware = new class extends Middleware {
            async request() { return new Promise(() => {}); }
        }();
        const fetch = t.mock.method(globalThis, 'fetch', async () => json());
        await assert.rejects(makeClient({ middlewares: [middleware] }).get('streams', { timeout: 20 }), { name: 'TimeoutError' });
        assert.equal(fetch.mock.callCount(), 0);
    });

    it('removes caller abort listeners and the deadline after success', async t => {
        const controller = new AbortController();
        const add = t.mock.method(controller.signal, 'addEventListener');
        const remove = t.mock.method(controller.signal, 'removeEventListener');
        let signal;
        t.mock.method(globalThis, 'fetch', async (url, options) => { signal = options.signal; return json(); });
        await makeClient().get('streams', { signal: controller.signal, timeout: 20 });
        assert.equal(add.mock.callCount(), 1);
        assert.equal(remove.mock.callCount(), 1);
        await new Promise(resolve => setTimeout(resolve, 30));
        controller.abort();
        assert.equal(signal.aborted, false);
    });
});

describe('Laravel validation errors', () => {
    it('maps 422 message and field arrays before error middleware without consuming the response', async t => {
        const data = { message: 'The given data was invalid.', errors: { title: ['Title is required.'], 'users.0.email': ['Invalid email.'] } };
        const fetch = t.mock.method(globalThis, 'fetch', async () => json(data, 422));
        let handled = 0;
        const middleware = new class extends Middleware {
            async error(error) {
                handled++;
                assert.deepEqual(error.errors, data.errors);
                return error;
            }
        }();
        await assert.rejects(makeClient({ middlewares: [middleware] }).post('streams', {
            idempotencyKey: 'invalid-entry', retries: 2, retryDelay: 0,
        }), asyncError => {
            assert.ok(asyncError instanceof FetchError);
            assert.equal(asyncError.status, 422);
            assert.equal(asyncError.message, data.message);
            assert.deepEqual(asyncError.data, data);
            assert.equal(asyncError.response.bodyUsed, false);
            return true;
        });
        assert.equal(handled, 1);
        assert.equal(fetch.mock.callCount(), 1);
    });

    it('keeps malformed/non-JSON 422 responses as FetchError', async t => {
        for (const body of ['invalid JSON', 'null', '{"message":123,"errors":[]}', '{}']) {
            const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(body, { status: 422 }));
            try {
                await makeClient().get('streams');
                assert.fail('expected FetchError');
            } catch (error) {
                assert.ok(error instanceof FetchError);
                assert.equal(error.status, 422);
                assert.deepEqual(error.errors, {});
                assert.equal(await error.response.text(), body);
            }
            fetch.mock.restore();
        }
    });

    it('runs error middleware once after retries are exhausted', async t => {
        let handled = 0;
        const middleware = new class extends Middleware {
            async error(error) { handled++; return error; }
        }();
        const fetch = t.mock.method(globalThis, 'fetch', async () => json({}, 503));
        await assert.rejects(makeClient({ middlewares: [middleware] }).get('streams', { retries: 2, retryDelay: 0 }));
        assert.equal(fetch.mock.callCount(), 3);
        assert.equal(handled, 1);
    });
});

describe('FetchRequest', () => {
    it('forwards its own signal when fetched directly', async t => {
        const controller = new AbortController();
        t.mock.method(globalThis, 'fetch', async (url, options) => {
            assert.equal(options.signal.aborted, false);
            controller.abort();
            assert.equal(options.signal.aborted, true);
            return json();
        });
        await new FetchRequest('https://streams.test/api', { signal: controller.signal }).fetch();
    });
});
