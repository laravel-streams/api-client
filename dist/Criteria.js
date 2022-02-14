var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Entry } from './Entry';
import { EntryCollection, PaginatedEntryCollection } from './EntryCollection';
import { paramsToQueryString } from './utils';
export const comparisonOperators = ['>', '<', '==', '!=', '>=', '<=', '!<', '!>', '<>'];
export const logicalOperators = ['BETWEEN', 'EXISTS', 'OR', 'AND', 'NOT', 'IN', 'ALL', 'ANY', 'LIKE', 'IS NULL', 'UNIQUE'];
export const operators = [].concat(comparisonOperators).concat(logicalOperators);
const isOperator = (value) => operators.includes(value);
const ensureArray = (value) => Array.isArray(value) ? value : [value];
export class Criteria {
    /**
     * Create a new instance.
     *
     * @param stream
     */
    constructor(stream) {
        this.stream = stream;
        this.parameters = [];
    }
    get http() { return this.stream.getStreams().http; }
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.where('id', id).first();
        });
    }
    /**
     * Return the first result.
     *
     * @returns
     */
    first() {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield this.limit(1).get();
            return collection.get(0);
        });
    }
    cache() { return this; }
    /**
     * Order the query by field/direction.
     *
     * @param key
     * @param direction
     * @returns
     */
    orderBy(key, direction = 'desc') {
        this.addParameter('orderBy', [key, direction]);
        return this;
    }
    /**
     * Limit the entries returned.
     *
     * @param value
     * @returns
     */
    limit(value) {
        this.addParameter('limit', value);
        return this;
    }
    where(...args) {
        let key, operator, value, nested;
        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        }
        else if (args.length === 3) {
            key = args[0];
            operator = args[1];
            value = args[2];
        }
        else if (args.length === 4) {
            key = args[0];
            operator = args[1];
            value = args[2];
            nested = args[3];
        }
        if (!isOperator(operator)) {
            throw new Error(`Criteria where() operator "${operator}" not valid `);
        }
        this.addParameter('where', [key, operator, value, nested]);
        return this;
    }
    orWhere(...args) {
        let key, operator, value;
        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        }
        else {
            key = args[0];
            operator = args[1];
            value = args[2];
        }
        if (!isOperator(operator)) {
            throw new Error(`Criteria orWhere() operator "${operator}" not valid `);
        }
        this.addParameter('where', [key, operator, value, 'or']);
        return this;
    }
    /**
     * Get the criteria results.
     *
     * @returns
     */
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const parameters = this.compileParameters();
            const params = { parameters };
            const response = yield this.http.getEntries(this.stream.id, params);
            return EntryCollection.fromResponse(response, this.stream);
        });
    }
    /**
     * Get paginated criteria results.
     *
     * @param per_page
     * @param page
     * @returns
     */
    paginate(per_page = 100, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let parameters = this.compileParameters();
            let params = { parameters, paginate: true, per_page, page };
            const response = yield this.http.getEntries(this.stream.id, params);
            return PaginatedEntryCollection.fromResponse(response, this.stream);
        });
    }
    //count(): number { return 0; }
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    create(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            let entry = this.newInstance(attributes);
            yield entry.save();
            return entry;
        });
    }
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    save(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            return entry.save();
        });
    }
    delete() { return this; }
    //truncate(): this { return this; }
    /**
     * Return an entry instance.
     *
     * @param attributes
     * @returns Entry
     */
    newInstance(attributes) {
        return new Entry(this.stream, attributes, true);
    }
    /**
     * Get the parameters.
     *
     * @returns
     */
    getParameters() {
        return this.parameters;
    }
    /**
     * Set the parameters.
     *
     * @param parameters
     * @returns
     */
    setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
    /**
     * Add a statement.
     *
     * @param name
     * @param value
     * @returns
     */
    addParameter(name, value) {
        this.parameters.push({ name, value });
        return this;
    }
    /**
     * Return standardized parameters.
     *
     * @returns
     */
    standardizeParameters() {
        return this.parameters.map(statement => ({ [statement.name]: ensureArray(statement.value) }));
    }
    compileParameters() {
        return paramsToQueryString(this.standardizeParameters());
    }
}
