import { Field } from './Field';
import { Repository } from './Repository';
import { Criteria } from './Criteria';
import { ApiLinks, ApiMeta, IBaseStream, IStreamLinks, IStreamMeta } from './types';
import { Streams } from './Streams';

export interface Stream<ID extends string = string> extends Omit<IBaseStream<ID>, 'fields'> { }

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
