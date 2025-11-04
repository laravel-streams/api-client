/**
 * Tests for the Client class
 */

import { describe, it, beforeEach } from 'node:test';
import { Client, AuthorizationMiddleware } from '../src/index.js';
import assert from 'assert';

describe('Client', () => {
    let client;

    beforeEach(() => {
        client = new Client({
            baseURL: 'http://localhost/api'
        });
    });

    describe('Constructor', () => {
        it('should create a client with baseURL', () => {
            assert.strictEqual(client.options.baseURL, 'http://localhost/api');
        });

        it('should have default request options', () => {
            assert.strictEqual(client.options.request.mode, 'cors');
            assert.strictEqual(client.options.request.headers['X-Requested-With'], 'XMLHttpRequest');
        });

        it('should initialize streams resource', () => {
            assert.ok(client.streams);
        });

        it('should initialize entries resource', () => {
            assert.ok(client.entries);
        });

        it('should have default middlewares', () => {
            assert.ok(Array.isArray(client.middlewares));
            assert.ok(client.middlewares.length > 0);
        });
    });

    describe('Middleware', () => {
        it('should allow adding middleware', () => {
            const initialCount = client.middlewares.length;
            const auth = new AuthorizationMiddleware({
                token: 'test-token'
            });
            
            client.use(auth);
            
            assert.strictEqual(client.middlewares.length, initialCount + 1);
            assert.strictEqual(client.middlewares[client.middlewares.length - 1], auth);
        });

        it('should support custom middlewares', () => {
            const customMiddleware = {
                options: { priority: { request: 50, response: 50, error: 50 } },
                async request(request) { return request; }
            };
            
            client.use(customMiddleware);
            
            assert.ok(client.middlewares.includes(customMiddleware));
        });
    });

    describe('Resources', () => {
        it('should have streams resource with client reference', () => {
            assert.strictEqual(client.streams.client, client);
        });

        it('should have entries resource with client reference', () => {
            assert.strictEqual(client.entries.client, client);
        });
    });

    describe('Request Method', () => {
        it('should be a function', () => {
            assert.strictEqual(typeof client.request, 'function');
        });

        it('should have request method', () => {
            // Just verify it exists and is callable
            assert.strictEqual(typeof client.request, 'function');
        });
    });
});
