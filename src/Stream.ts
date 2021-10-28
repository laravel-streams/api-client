import { Field } from './Field';
import { Repository } from './Repository';
import { Criteria } from './Criteria';
import { ApiLinks, ApiMeta, IBaseStream, IStreamLinks, IStreamMeta } from './types';
import { Streams } from './Streams';

export interface Stream<ID extends string = string> extends Omit<IBaseStream<ID>, 'fields'> { }


/**
 *
 * Represents a stream and can be used to get it's data.
 *
 * The example below uses:
 * - {@linkcode Stream.repository} method returns {@linkcode Repository}
 * - {@linkcode Stream.entries} method returns {@linkcode Criteria}
 * ```ts
 * const repository = await stream.repository()
 * const client = await repository.find(2);
 * const clients = await stream.entries()
 *                                 .where('age', '>', 5)
 *                                 .where('age', '<', 50)
 *                                 .orderBy('age', 'asc')
 *                                 .get();
 *     for(const client of clients){
 *         client.email;
 *         client.age;
 *     }
 * }
 * ```
 */
export class Stream<ID extends string = string> {

    constructor(
        public readonly streams:Streams,
        stream: IBaseStream<ID>,
        public readonly meta?: ApiMeta,
        public readonly links?: ApiLinks,
    ) {

        if (stream.fields) {
            this.fields = new Map(Object.entries(stream.fields).map(([key, field]) => [key, new Field(field)]))
            delete stream.fields;
        }

        Object.assign(this, stream);
    }

    /**
     * The repository instance.
     */
    protected _repository: Repository;

    /**
     * Stream validation rules.
     */
    protected _rules: Array<any>;

    /**
     * Custom stream validators.
     */
    protected _validators: Array<any>;

    /**
     * The stream fields.
     */
    public fields: Map<string, Field>

    /**
     * Return the entries repository.
     *
     * @returns Repository
     */
     get repository(): Repository {

        if (!this._repository) {
            this._repository = new Repository(this);
        }

        return this._repository;
    };

    /**
     * Return the entries criteria.
     *
     * @returns Criteria
     */
    entries(): Criteria {
        return this.repository.newCriteria();
    };

    // validator;
    // hasRule;
    // getRule;
    // ruleParameters;
    isRequired;
    config;
    cached;
    cache;
    forget;
    flush;
    toArray;
    toJson;
    jsonSerialize;
    __toString;
    onInitializing;
    onInitialized;
    extendInput;
    importInput;
    normalizeInput;
    fieldsInput;
    merge;

}
