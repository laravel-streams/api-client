/**
 * Tests for the Criteria class
 */

import { describe, it, beforeEach } from 'node:test';
import { Criteria } from '../src/index.js';
import assert from 'assert';

describe('Criteria', () => {
    let criteria;

    beforeEach(() => {
        criteria = new Criteria();
    });

    describe('Constructor', () => {
        it('should create a criteria instance', () => {
            assert.ok(criteria instanceof Criteria);
        });

        it('should initialize empty parameters', () => {
            assert.ok(Array.isArray(criteria.parameters));
            assert.strictEqual(criteria.parameters.length, 0);
        });

        it('should have static make method', () => {
            const c = Criteria.make();
            assert.ok(c instanceof Criteria);
        });
    });

    describe('where()', () => {
        it('should add a where clause with two arguments', () => {
            criteria.where('status', 'published');
            assert.strictEqual(criteria.parameters.length, 1);
            assert.strictEqual(criteria.parameters[0].name, 'where');
            assert.deepStrictEqual(criteria.parameters[0].value, ['status', '==', 'published', null]);
        });

        it('should add a where clause with operator', () => {
            criteria.where('views', '>', 100);
            assert.strictEqual(criteria.parameters.length, 1);
            assert.deepStrictEqual(criteria.parameters[0].value, ['views', '>', 100, null]);
        });

        it('should support chaining', () => {
            const result = criteria.where('status', 'published');
            assert.strictEqual(result, criteria);
        });

        it('should support multiple where clauses', () => {
            criteria
                .where('status', 'published')
                .where('views', '>', 100)
                .where('category', 'technology');
            
            assert.strictEqual(criteria.parameters.length, 3);
        });

        it('should throw error for invalid operator', () => {
            assert.throws(() => {
                criteria.where('field', 'INVALID', 'value');
            }, /operator "INVALID" not valid/);
        });
    });

    describe('orWhere()', () => {
        it('should add an OR where clause', () => {
            criteria.orWhere('status', 'featured');
            assert.strictEqual(criteria.parameters.length, 1);
            assert.deepStrictEqual(criteria.parameters[0].value, ['status', '==', 'featured', 'or']);
        });

        it('should work with operator', () => {
            criteria.orWhere('views', '>', 500);
            assert.deepStrictEqual(criteria.parameters[0].value, ['views', '>', 500, 'or']);
        });
    });

    describe('orderBy()', () => {
        it('should add orderBy clause with default direction', () => {
            criteria.orderBy('created_at');
            assert.strictEqual(criteria.parameters.length, 1);
            assert.strictEqual(criteria.parameters[0].name, 'orderBy');
            assert.deepStrictEqual(criteria.parameters[0].value, ['created_at', 'desc']);
        });

        it('should add orderBy clause with custom direction', () => {
            criteria.orderBy('title', 'asc');
            assert.deepStrictEqual(criteria.parameters[0].value, ['title', 'asc']);
        });

        it('should support multiple orderBy clauses', () => {
            criteria
                .orderBy('views', 'desc')
                .orderBy('created_at', 'asc');
            
            assert.strictEqual(criteria.parameters.length, 2);
        });
    });

    describe('limit()', () => {
        it('should add limit clause', () => {
            criteria.limit(10);
            assert.strictEqual(criteria.parameters.length, 1);
            assert.strictEqual(criteria.parameters[0].name, 'limit');
            assert.strictEqual(criteria.parameters[0].value, 10);
        });
    });

    describe('first()', () => {
        it('should set limit to 1', () => {
            criteria.first();
            assert.strictEqual(criteria.parameters.length, 1);
            assert.strictEqual(criteria.parameters[0].name, 'limit');
            assert.strictEqual(criteria.parameters[0].value, 1);
        });
    });

    describe('find()', () => {
        it('should add where id and limit 1', () => {
            criteria.find(123);
            assert.strictEqual(criteria.parameters.length, 2);
            
            const whereParam = criteria.parameters.find(p => p.name === 'where');
            const limitParam = criteria.parameters.find(p => p.name === 'limit');
            
            assert.ok(whereParam);
            assert.ok(limitParam);
            assert.deepStrictEqual(whereParam.value, ['id', '==', 123, null]);
            assert.strictEqual(limitParam.value, 1);
        });
    });

    describe('paginate()', () => {
        it('should add pagination parameters with defaults', () => {
            criteria.paginate();
            assert.strictEqual(criteria.parameters.length, 3);
            
            const params = criteria.parameters.reduce((acc, p) => {
                acc[p.name] = p.value;
                return acc;
            }, {});
            
            assert.strictEqual(params.paginate, true);
            assert.strictEqual(params.per_page, 100);
            assert.strictEqual(params.page, 1);
        });

        it('should accept custom pagination values', () => {
            criteria.paginate(25, 3);
            
            const params = criteria.parameters.reduce((acc, p) => {
                acc[p.name] = p.value;
                return acc;
            }, {});
            
            assert.strictEqual(params.per_page, 25);
            assert.strictEqual(params.page, 3);
        });
    });

    describe('standardizeParameters()', () => {
        it('should convert parameters to object', () => {
            criteria
                .where('status', 'published')
                .orderBy('created_at', 'desc')
                .limit(10);
            
            const standardized = criteria.standardizeParameters();
            
            assert.ok(typeof standardized === 'object');
            assert.ok(standardized.where);
            assert.ok(standardized.orderBy);
            assert.strictEqual(standardized.limit, 10);
        });
    });

    describe('Complex Queries', () => {
        it('should handle complex query building', () => {
            criteria
                .where('category', 'technology')
                .where('published_at', '>=', '2024-01-01')
                .where('views', '>', 500)
                .orWhere('featured', true)
                .orderBy('views', 'desc')
                .orderBy('published_at', 'desc')
                .paginate(50, 1);
            
            assert.ok(criteria.parameters.length > 0);
            
            const standardized = criteria.standardizeParameters();
            assert.ok(standardized);
        });
    });
});
