import { Stream } from './Stream';
import { Entry, IEntry } from './Entry';
import { EntryCollection, PaginatedEntryCollection } from './EntryCollection';
import { streams } from './types';
import { Http } from './Http';
export declare type OrderByDirection = 'asc' | 'desc';
export declare type ComparisonOperator = '>' | '<' | '==' | '!=' | '>=' | '<=' | '!<' | '!>' | '<>';
export declare const comparisonOperators: ComparisonOperator[];
export declare type LogicalOperator = 'BETWEEN' | 'EXISTS' | 'OR' | 'AND' | 'NOT' | 'IN' | 'ALL' | 'ANY' | 'LIKE' | 'IS NULL' | 'UNIQUE';
export declare const logicalOperators: LogicalOperator[];
export declare const operators: Operator[];
export declare type Operator = ComparisonOperator | LogicalOperator;
export interface CriteriaParameter {
    name: string;
    value: any;
}
export declare class Criteria<ID extends streams.StreamID = streams.StreamID> {
    protected stream: Stream<ID>;
    parameters: CriteriaParameter[];
    /**
     * Create a new instance.
     *
     * @param stream
     */
    constructor(stream: Stream<ID>);
    get http(): Http;
    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns
     */
    find(id: string | number): Promise<IEntry<ID>>;
    /**
     * Return the first result.
     *
     * @returns
     */
    first(): Promise<IEntry<ID>>;
    cache(): this;
    /**
     * Order the query by field/direction.
     *
     * @param key
     * @param direction
     * @returns
     */
    orderBy<K extends keyof streams.Entries[ID]>(key: string, direction?: OrderByDirection): this;
    /**
     * Limit the entries returned.
     *
     * @param value
     * @returns
     */
    limit(value: number): this;
    /**
     * Constrain the query by a typical
     * field, operator, value argument.
     *
     * @param key
     * @param value
     */
    where<K extends keyof streams.Entries[ID]>(key: K, operator: Operator, value: streams.Entries[ID][K], nested: any): this;
    where<K extends keyof streams.Entries[ID]>(key: K, operator: Operator, value: streams.Entries[ID][K]): this;
    where<K extends keyof streams.Entries[ID]>(key: K, value: streams.Entries[ID][K]): this;
    orWhere<K extends keyof streams.Entries[ID]>(key: K, operator: Operator, value: streams.Entries[ID][K]): this;
    orWhere<K extends keyof streams.Entries[ID]>(key: K, value: streams.Entries[ID][K]): this;
    /**
     * Get the criteria results.
     *
     * @returns
     */
    get(): Promise<EntryCollection<ID>>;
    /**
     * Get paginated criteria results.
     *
     * @param per_page
     * @param page
     * @returns
     */
    paginate(per_page?: number, page?: number): Promise<PaginatedEntryCollection<ID>>;
    /**
     * Create a new entry.
     *
     * @param attributes
     * @returns
     */
    create(attributes: any): Promise<IEntry<ID>>;
    /**
     * Save an entry.
     *
     * @param entry
     * @returns
     */
    save(entry: Entry): Promise<boolean>;
    delete(): this;
    /**
     * Return an entry instance.
     *
     * @param attributes
     * @returns Entry
     */
    newInstance(attributes: any): IEntry<ID>;
    /**
     * Get the parameters.
     *
     * @returns
     */
    getParameters(): any;
    /**
     * Set the parameters.
     *
     * @param parameters
     * @returns
     */
    setParameters(parameters: any): this;
    /**
     * Add a statement.
     *
     * @param name
     * @param value
     * @returns
     */
    protected addParameter(name: string, value: any | any[]): this;
    /**
     * Return standardized parameters.
     *
     * @returns
     */
    compileParameters(): {
        [x: string]: any[];
    }[];
}
