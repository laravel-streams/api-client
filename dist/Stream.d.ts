import { Field } from './Field';
import { Repository } from './Repository';
import { Criteria } from './Criteria';
import { ApiLinks, ApiMeta, IBaseStream } from './types';
import { Streams } from './Streams';
export interface Stream<ID extends string = string> extends Omit<IBaseStream<ID>, 'fields'> {
}
export declare class Stream<ID extends string = string> {
    readonly streams: Streams;
    readonly meta?: ApiMeta;
    readonly links?: ApiLinks;
    constructor(streams: Streams, stream: IBaseStream<ID>, meta?: ApiMeta, links?: ApiLinks);
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
    fields: Map<string, Field>;
    /**
     * Return the entries repository.
     *
     * @returns Repository
     */
    get repository(): Repository;
    /**
     * Return the entries criteria.
     *
     * @returns Criteria
     */
    entries(): Criteria;
    isRequired: any;
    config: any;
    cached: any;
    cache: any;
    forget: any;
    flush: any;
    toArray: any;
    toJson: any;
    jsonSerialize: any;
    __toString: any;
    onInitializing: any;
    onInitialized: any;
    extendInput: any;
    importInput: any;
    normalizeInput: any;
    fieldsInput: any;
    merge: any;
}
