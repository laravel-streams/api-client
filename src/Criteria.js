import { paramsToQueryString } from './utils.js';

/**
 * Comparison operators
 */
export const comparisonOperators = ['>', '<', '==', '!=', '>=', '<=', '!<', '!>', '<>'];

/**
 * Logical operators
 */
export const logicalOperators = ['BETWEEN', 'EXISTS', 'OR', 'AND', 'NOT', 'IN', 'ALL', 'ANY', 'LIKE', 'IS NULL', 'UNIQUE'];

/**
 * All operators
 */
export const operators = [].concat(comparisonOperators).concat(logicalOperators);

/**
 * Check if value is a valid operator
 */
const isOperator = (value) => operators.includes(value);

/**
 * Criteria builder class - similar to PHP Laravel query builder
 */
export class Criteria {
    constructor() {
        this.parameters = [];
    }

    static make() {
        return new this();
    }

    /**
     * Find an entry by ID
     */
    find(id) {
        return this.where('id', id).first();
    }

    /**
     * Return the first result
     */
    first() {
        return this.limit(1);
    }

    /**
     * Order the query by field/direction
     */
    orderBy(key, direction = 'desc') {
        this.addParameter('orderBy', [key, direction]);
        return this;
    }

    /**
     * Limit the entries returned
     */
    limit(value) {
        this.addParameter('limit', value);
        return this;
    }

    /**
     * Constrain the query by field, operator, value
     * Supports multiple signatures:
     * - where(key, value)
     * - where(key, operator, value)
     * - where(key, operator, value, nested)
     */
    where(...args) {
        let key, operator, value, nested = null;

        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        } else if (args.length === 3) {
            key = args[0];
            operator = args[1];
            value = args[2];
        } else if (args.length === 4) {
            key = args[0];
            operator = args[1];
            value = args[2];
            nested = args[3];
        }

        if (!isOperator(operator)) {
            throw new Error(`Criteria where() operator "${operator}" not valid`);
        }

        this.addParameter('where', [key, operator, value, nested]);
        return this;
    }

    /**
     * Add an OR WHERE clause
     */
    orWhere(...args) {
        let key, operator, value;

        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        } else {
            key = args[0];
            operator = args[1];
            value = args[2];
        }

        if (!isOperator(operator)) {
            throw new Error(`Criteria orWhere() operator "${operator}" not valid`);
        }

        this.addParameter('where', [key, operator, value, 'or']);
        return this;
    }

    /**
     * Get paginated criteria results
     */
    paginate(per_page = 100, page = 1) {
        this.addParameter('paginate', true);
        this.addParameter('per_page', per_page);
        this.addParameter('page', page);
        return this;
    }

    /**
     * Get the parameters
     */
    getParameters() {
        return this.parameters;
    }

    /**
     * Set the parameters
     */
    setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }

    /**
     * Add a parameter
     */
    addParameter(name, value) {
        this.parameters.push({ name, value });
        return this;
    }

    /**
     * Return standardized parameters
     */
    standardizeParameters() {
        const result = {};
        const filters = new Map();
        for (const { name, value } of this.parameters) {
            if (name === 'where') {
                const [field, operator, operand, boolean] = value;
                if (boolean && boolean !== 'and') {
                    throw new Error('GET criteria do not support OR or nested filters; use the API query endpoint');
                }
                const conditions = filters.get(field) || new Map();
                const apiOperator = operator === '==' ? '=' : operator.toLowerCase();
                if (conditions.has(apiOperator)) {
                    throw new Error(`Duplicate ${field} ${operator} filter; use the API query endpoint`);
                }
                conditions.set(apiOperator, operand);
                filters.set(field, conditions);
            } else if (name === 'orderBy') {
                result.order_by ||= {};
                Object.defineProperty(result.order_by, value[0], { value: value[1], enumerable: true, configurable: true });
            } else {
                result[name] = value;
            }
        }
        if (filters.size) {
            result.where = Object.fromEntries(Array.from(filters, ([field, conditions]) => [
                field, conditions.size === 1 && conditions.has('=') && !Array.isArray(conditions.get('='))
                    && conditions.get('=') !== null ? conditions.get('=') : Object.fromEntries(conditions),
            ]));
        }
        return result;
    }

    /**
     * Compile criteria to query string
     */
    compile() {
        return paramsToQueryString(this.standardizeParameters());
    }
}
