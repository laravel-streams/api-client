/**
 * Tests for Middleware classes
 */

import { describe, it } from 'node:test';
import {
    Middleware,
    AuthorizationMiddleware,
    CriteriaMiddleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware
} from '../src/index.js';
import { Client } from '../src/index.js';
import { Criteria } from '../src/index.js';
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
