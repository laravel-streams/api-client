import { Field } from './Field';
import { Repository } from './Repository';
import { Criteria } from './Criteria';
import { ApiLinks, ApiMeta, IBaseStream, IStream } from './types';
import { Streams } from './Streams';
import deepmerge from 'deepmerge';
import { objectify } from './utils';

// export interface Stream<ID extends string = string> extends Omit<IBaseStream<ID>, 'fields'> {}
export interface Stream<ID extends string = string> extends IStream<ID> {}


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
        public readonly streams: Streams,
        protected _stream: IBaseStream<ID>,
        public readonly meta?: ApiMeta,
        public readonly links?: ApiLinks,
    ) {
        this.unserialize(_stream);
        let proxy = new Proxy(this, {
            get(target: Stream<ID>, p: string | symbol, receiver: any): any {
                if ( Reflect.has(target, p) ) {
                    return Reflect.get(target, p, receiver);
                }
                if ( Reflect.has(target._stream, p) ) {
                    return Reflect.get(target._stream, p);
                }
            },
            set(target: Stream<ID>, p: string | symbol, value: any, receiver: any): boolean {
                if ( Reflect.has(target, p) ) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(target._stream, p, value);
            },
        });
        return proxy;
    }

    /**
     * The repository instance.
     */
    protected _repository: Repository;

    /**
     * The stream fields.
     */
    public fields: Map<string, Field>;

    /**
     * Return the entries repository.
     *
     * @returns Repository
     */
    get repository(): Repository {

        if ( !this._repository ) {
            this._repository = new Repository(this);
        }

        return this._repository;
    };

    unserialize(stream: IStream<ID>) {
        this.fields = new Map(Object.entries(stream.fields || {}).map(([ key, field ]) => [ key, new Field(field) ]));
    }

    serialize(): IStream<ID> {
        let stream    = deepmerge({}, this._stream, { clone: true });
        stream.fields = Object
        .entries(Object.fromEntries(this.fields.entries()))
        .map(([ id, field ]) => [ id, field.serialize() ])
        .reduce(objectify, {});

        return stream;
    }

    async save(): Promise<boolean> {
        try {
            await this.streams.http.patchStream(this._stream.id, this.serialize());
            return true;
        } catch (e) {
            return false;
        }
    }

    async delete(): Promise<boolean> {
        try {
            await this.streams.http.deleteStream(this._stream.id);
            return true;
        } catch (e) {
            return false;
        }
    }

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
    // isRequired;
    // config;
    // cached;
    // cache;
    // forget;
    // flush;
    // toArray;
    // toJson;
    // jsonSerialize;
    // __toString;
    // onInitializing;
    // onInitialized;
    // extendInput;
    // importInput;
    // normalizeInput;
    // fieldsInput;
    // merge;

}
