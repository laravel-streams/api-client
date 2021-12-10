import { Stream } from './Stream';
import { Entry, IEntry } from './Entry';
import { EntryCollection, PaginatedEntryCollection } from './EntryCollection';
import { streams } from './types';
import { Http } from './Http';

export type OrderByDirection =
    'asc'
    | 'desc';

export type ComparisonOperator =
    | '>'
    | '<'
    | '=='
    | '!='
    | '>='
    | '<='
    | '!<'
    | '!>'
    | '<>';

export const comparisonOperators: ComparisonOperator[] = [ '>', '<', '==', '!=', '>=', '<=', '!<', '!>', '<>' ];

export type LogicalOperator =
    | 'BETWEEN'
    | 'EXISTS'
    | 'OR'
    | 'AND'
    | 'NOT'
    | 'IN'
    | 'ALL'
    | 'ANY'
    | 'LIKE'
    | 'IS NULL'
    | 'UNIQUE';

export const logicalOperators: LogicalOperator[] = [ 'BETWEEN', 'EXISTS', 'OR', 'AND', 'NOT', 'IN', 'ALL', 'ANY', 'LIKE', 'IS NULL', 'UNIQUE' ];

export const operators: Operator[] = [].concat(comparisonOperators).concat(logicalOperators);

export type Operator =
    ComparisonOperator
    | LogicalOperator;

const isOperator = (value: any): value is Operator => operators.includes(value);

const ensureArray = (value: any) => Array.isArray(value) ? value : [ value ];

export interface CriteriaParameter {
    name: string;
    value: any;
}

export class Criteria<ID extends streams.StreamID = streams.StreamID> {

    parameters: CriteriaParameter[] = [];

    /**
     * Create a new instance.
     *
     * @param stream
     */
    constructor(protected stream: Stream<ID>) { }

    get http(): Http {return this.stream.getStreams().http;}

    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns
     */
    async find(id: string | number): Promise<IEntry<ID>> {
        return this.where('id', id).first();
    }

    /**
     * Return the first result.
     *
     * @returns
     */
    async first(): Promise<IEntry<ID>> {

        let collection = await this.limit(1).get();

        return collection.get(0 );
    }

    cache(): this { return this; }

    /**
     * Order the query by field/direction.
     *
     * @param key
     * @param direction
     * @returns
     */
    orderBy<K extends keyof streams.Entries[ID]>(key: string, direction: OrderByDirection = 'desc'): this {

        this.addParameter('orderBy', [ key, direction ]);

        return this;
    }

    /**
     * Limit the entries returned.
     *
     * @param value
     * @returns
     */
    limit(value: number): this {

        this.addParameter('limit', value);

        return this;
    }

    /**
     * Constrain the query by a typical
     * field, operator, value argument.
     *
     * @param key
     * @param value
     */
    where<K extends keyof streams.Entries[ID]>(key: K, operator: Operator, value: streams.Entries[ID][K], nested: any): this
    where<K extends keyof streams.Entries[ID]>(key: K, operator: Operator, value: streams.Entries[ID][K]): this
    where<K extends keyof streams.Entries[ID]>(key: K, value: streams.Entries[ID][K]): this
    where(...args): this {

        let key: string,
            operator: Operator,
            value: any,
            nested: null;

        if ( args.length === 2 ) {
            key      = args[ 0 ];
            operator = '==';
            value    = args[ 1 ];
        } else if ( args.length === 3 ) {
            key      = args[ 0 ];
            operator = args[ 1 ];
            value    = args[ 2 ];
        } else if ( args.length === 4 ) {
            key      = args[ 0 ];
            operator = args[ 1 ];
            value    = args[ 2 ];
            nested   = args[ 3 ];
        }

        if ( !isOperator(operator) ) {
            throw new Error(`Criteria where() operator "${operator}" not valid `);
        }

        this.addParameter('where', [ key, operator, value, nested ]);

        return this;
    }

    orWhere<K extends keyof streams.Entries[ID]>(key: K, operator: Operator, value: streams.Entries[ID][K]): this
    orWhere<K extends keyof streams.Entries[ID]>(key: K, value: streams.Entries[ID][K]): this
    orWhere(...args): this {

        let key: string,
            operator: Operator,
            value: any;

        if ( args.length === 2 ) {
            key      = args[ 0 ];
            operator = '==';
            value    = args[ 1 ];
        } else {
            key      = args[ 0 ];
            operator = args[ 1 ];
            value    = args[ 2 ];
        }

        if ( !isOperator(operator) ) {
            throw new Error(`Criteria orWhere() operator "${operator}" not valid `);
        }

        this.addParameter('where', [ key, operator, value, 'or' ]);

        return this;
    }

    /**
     * Get the criteria results.
     *
     * @returns
     */
    async get(): Promise<EntryCollection<ID>> {
        const parameters = this.compileParameters();
        const params     = { parameters };
        const response   = await this.http.getEntries(this.stream.id, params);
        return EntryCollection.fromResponse<ID>(response, this.stream);
    }

    /**
     * Get paginated criteria results.
     *
     * @param per_page
     * @param page
     * @returns
     */
    async paginate(per_page: number = 100, page: number = 1): Promise<PaginatedEntryCollection<ID>> {

        let parameters = this.compileParameters();
        let params     = { parameters, paginate: true, per_page, page };
        const response = await this.http.getEntries(this.stream.id, params);
        return PaginatedEntryCollection.fromResponse<ID>(response as any, this.stream);
    }

    //count(): number { return 0; }

    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    async create(attributes: any): Promise<IEntry<ID>> {

        let entry = this.newInstance(attributes);

        await entry.save();

        return entry;
    }

    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    async save(entry: Entry): Promise<boolean> {
        return entry.save();
    }

    delete(): this { return this; }

    //truncate(): this { return this; }

    /**
     * Return an entry instance.
     *
     * @param attributes
     * @returns Entry
     */
    public newInstance(attributes: any): IEntry<ID> {
        return new Entry<ID>(this.stream, attributes, true);
    }

    /**
     * Get the parameters.
     *
     * @returns
     */
    public getParameters(): any {
        return this.parameters;
    }

    /**
     * Set the parameters.
     *
     * @param parameters
     * @returns
     */
    public setParameters(parameters: any): this {

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
    protected addParameter(name: string, value: any | any[]) {

        this.parameters.push({ name, value });

        return this;
    }

    /**
     * Return standardized parameters.
     *
     * @returns
     */
    public compileParameters() {
        return this.parameters.map(statement => ({ [ statement.name ]: ensureArray(statement.value) }));
    }
}
