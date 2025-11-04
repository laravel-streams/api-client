import { paramsToQueryString } from './utils';

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

export class Criteria {
    parameters: CriteriaParameter[] = [];

    public static make(): Criteria {
        return new this();
    }

    /**
     * Find an entry by ID.
     *
     * @param id
     * @returns
     */
    public find(id: string | number): this {
        return this.where('id', id).first();
    }

    /**
     * Return the first result.
     *
     * @returns
     */
    public first(): this {
        return this.limit(1);
    }

    /**
     * Order the query by field/direction.
     *
     * @param key
     * @param direction
     * @returns this
     */
    public orderBy(key: string, direction: OrderByDirection = 'desc'): this {

        this.addParameter('orderBy', [ key, direction ]);

        return this;
    }

    /**
     * Limit the entries returned.
     *
     * @param value
     * @returns
     */
    public limit(value: number): this {

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
    public where(key: string, operator: Operator, value: any, nested: any): this
    public where(key: string, operator: Operator, value: any): this
    public where(key: string, value: any): this
    public where(...args): this {

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

    public orWhere(key: string, operator: Operator, value: any): this
    public orWhere(key: string, value: any): this
    public orWhere(...args): this {

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
     * Get paginated criteria results.
     *
     * @param per_page
     * @param page
     * @returns
     */
    public paginate(per_page: number = 100, page: number = 1): any {
        this.addParameter('paginate', true);
        this.addParameter('per_page', per_page);
        this.addParameter('page', page);
        return this;
    }


    /**
     * Get the parameters.
     *
     * @returns
     */
    public getParameters(): any[] {
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
    public addParameter(name: string, value: any | any[]) {

        this.parameters.push({ name, value });

        return this;
    }

    /**
     * Return standardized parameters.
     *
     * @returns
     */
    public standardizeParameters(): Record<string, any> {
        return this.parameters.map(kv => [ kv[ 'name' ], kv[ 'value' ] ]).reduce((obj, [ k, v ], i, data) => {
            if ( Array.isArray(v) ) {
                data.slice().filter(kv => kv[ 'name' ] === k);
            }
            return { ...obj, [ k ]: v };
        }, {});
    }

    public compile(): string {
        return paramsToQueryString(this.standardizeParameters());
    }

}
