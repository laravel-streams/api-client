/**
 * Tests for utility functions
 */

import { describe, it } from 'node:test';
import { Str, mergeObjects, stringify, createCustomMap } from '../src/utils.js';
import assert from 'assert';

describe('Utils', () => {
    describe('Str', () => {
        describe('random()', () => {
            it('should generate random string of default length', () => {
                const str = Str.random();
                assert.strictEqual(str.length, 15);
            });

            it('should generate random string of custom length', () => {
                const str = Str.random(10);
                assert.strictEqual(str.length, 10);
            });

            it('should generate different strings', () => {
                const str1 = Str.random();
                const str2 = Str.random();
                assert.notStrictEqual(str1, str2);
            });
        });

        describe('ensureLeft()', () => {
            it('should add prefix if missing', () => {
                assert.strictEqual(Str.ensureLeft('test', '/'), '/test');
            });

            it('should not add prefix if present', () => {
                assert.strictEqual(Str.ensureLeft('/test', '/'), '/test');
            });
        });

        describe('ensureRight()', () => {
            it('should add suffix if missing', () => {
                assert.strictEqual(Str.ensureRight('test', '/'), 'test/');
            });

            it('should not add suffix if present', () => {
                assert.strictEqual(Str.ensureRight('test/', '/'), 'test/');
            });
        });

        describe('stripLeft()', () => {
            it('should remove prefix if present', () => {
                assert.strictEqual(Str.stripLeft('/test', '/'), 'test');
            });

            it('should not change if prefix not present', () => {
                assert.strictEqual(Str.stripLeft('test', '/'), 'test');
            });
        });

        describe('stripRight()', () => {
            it('should remove suffix if present', () => {
                assert.strictEqual(Str.stripRight('test/', '/'), 'test');
            });

            it('should not change if suffix not present', () => {
                assert.strictEqual(Str.stripRight('test', '/'), 'test');
            });
        });

        describe('ucfirst()', () => {
            it('should capitalize first letter', () => {
                assert.strictEqual(Str.ucfirst('hello'), 'Hello');
            });

            it('should not change already capitalized', () => {
                assert.strictEqual(Str.ucfirst('Hello'), 'Hello');
            });
        });

        describe('lcfirst()', () => {
            it('should lowercase first letter', () => {
                assert.strictEqual(Str.lcfirst('Hello'), 'hello');
            });

            it('should not change already lowercase', () => {
                assert.strictEqual(Str.lcfirst('hello'), 'hello');
            });
        });

        describe('parameters()', () => {
            it('should replace parameters in string', () => {
                const result = Str.parameters('/api/:id/:action', { id: '123', action: 'edit' });
                assert.strictEqual(result, '/api/123/edit');
            });
        });
    });

    describe('mergeObjects()', () => {
        it('should merge simple objects', () => {
            const obj1 = { a: 1, b: 2 };
            const obj2 = { b: 3, c: 4 };
            const result = mergeObjects(obj1, obj2);
            
            assert.deepStrictEqual(result, { a: 1, b: 3, c: 4 });
        });

        it('should deep merge nested objects', () => {
            const obj1 = { a: { b: 1, c: 2 } };
            const obj2 = { a: { c: 3, d: 4 } };
            const result = mergeObjects(obj1, obj2);
            
            assert.deepStrictEqual(result, { a: { b: 1, c: 3, d: 4 } });
        });

        it('should handle multiple objects', () => {
            const obj1 = { a: 1 };
            const obj2 = { b: 2 };
            const obj3 = { c: 3 };
            const result = mergeObjects(obj1, obj2, obj3);
            
            assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
        });
    });

    describe('stringify()', () => {
        it('should convert simple object to query string', () => {
            const result = stringify({ a: 1, b: 2 });
            assert.strictEqual(result, 'a=1&b=2');
        });

        it('should handle arrays', () => {
            const result = stringify({ tags: ['a', 'b', 'c'] });
            assert.ok(result.includes('tags'));
        });

        it('should handle nested objects', () => {
            const result = stringify({ filter: { status: 'active', type: 'post' } });
            assert.ok(result.includes('filter'));
        });

        it('should skip null and undefined values', () => {
            const result = stringify({ a: 1, b: null, c: undefined, d: 2 });
            assert.strictEqual(result, 'a=1&d=2');
        });
    });

    describe('createCustomMap()', () => {
        it('should create a Map with initial values', () => {
            const map = createCustomMap({ a: 1, b: 2 });
            assert.strictEqual(map.get('a'), 1);
            assert.strictEqual(map.get('b'), 2);
        });

        it('should have toObject method', () => {
            const map = createCustomMap({ a: 1, b: 2 });
            const obj = map.toObject();
            assert.deepStrictEqual(obj, { a: 1, b: 2 });
        });

        it('should have toKeys method', () => {
            const map = createCustomMap({ a: 1, b: 2 });
            const keys = map.toKeys();
            assert.ok(keys.includes('a'));
            assert.ok(keys.includes('b'));
        });

        it('should have merge method', () => {
            const map = createCustomMap({ a: 1 });
            map.merge({ b: 2, c: 3 });
            assert.strictEqual(map.get('a'), 1);
            assert.strictEqual(map.get('b'), 2);
            assert.strictEqual(map.get('c'), 3);
        });

        it('should have empty method', () => {
            const map1 = createCustomMap({});
            const map2 = createCustomMap({ a: 1 });
            assert.strictEqual(map1.empty(), true);
            assert.strictEqual(map2.empty(), false);
        });
    });
});
