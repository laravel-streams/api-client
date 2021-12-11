import { Field, isFieldData } from './Field';
import { Repository } from './Repository';
import { Criteria } from './Criteria';
import { ApiLinks, ApiMeta, IBaseStream, IStream, StreamID } from './types';
import { Streams } from './Streams';
import deepmerge from 'deepmerge';
import { objectify } from './utils';
import { FieldCollection } from './FieldCollection';

// export interface Stream<ID extends string = string> extends Omit<IBaseStream<ID>, 'fields'> {}
export interface Stream<ID extends StreamID = StreamID> extends IStream<ID> {}


/**
 *
 * Represents a stream and can be used to get it's data.
 *
 * The example below uses:
 * - {@linkcode Stream.getRepository} method returns {@linkcode Repository}
 * - {@linkcode Stream.getEntries} method returns {@linkcode Criteria}
 * ```ts
 * const repository = await stream.getRepository()
 * const client = await repository.find(2);
 * const clients = await stream.getEntries()
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
export class Stream<ID extends StreamID = StreamID> {
    constructor(
        streams: Streams,
        stream: IBaseStream<ID>,
        meta?: ApiMeta,
        links?: ApiLinks,
    ) {
        this.#streams = streams;
        this.#stream  = stream;
        this.#meta    = meta;
        this.#links   = links;
        this.unserialize(stream);
        const self = this
        let proxy = new Proxy(this, {
            get: (target: Stream<ID>, p: string | symbol, receiver: any) => {
                if(typeof self[p.toString()] === 'function'){
                    return self[p.toString()].bind(self);
                }
                if(self.#stream[p.toString()]){
                    return self.#stream[p.toString()]
                }
                if ( Reflect.has(target.#stream, p) ) {
                    return Reflect.get(target.#stream, p);
                }
                if ( Reflect.has(target, p) ) {
                    return Reflect.get(target, p).bind(this);
                }
            },
            set: (target: Stream<ID>, p: string | symbol, value: any, receiver: any): boolean => {
                if(self.#stream[p.toString()]){
                    self.#stream[p.toString()] = value;
                    return true;
                }
                if ( Reflect.has(target, p) ) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(this.#stream, p, value);
            },
        });
        this.#proxy=proxy as any;
        return proxy;
    }
    #proxy:ProxyHandler<Stream<ID>>
    #stream: IBaseStream<ID>;
    #streams: Streams;
    #meta?: ApiMeta;
    #links?: ApiLinks;
    #repository: Repository<ID>;
    #fields: FieldCollection;

    public getFields(): FieldCollection {return this.#fields;}

    public getStreams(): Streams {return this.#streams;}

    public getMeta(): ApiMeta {return this.#meta;}

    public getLinks(): ApiLinks {return this.#links;}

    public getRepository(): Repository<ID> {
        if ( !this.#repository ) {
            this.#repository = new Repository(this.#proxy as any);
        }

        return this.#repository;
    };

    public getEntries(): Criteria<ID> {return this.getRepository().newCriteria(); };

    public async save(): Promise<boolean> {
        try {
            await this.#streams.http.patchStream(this.#stream.id, this.serialize());
            return true;
        } catch (e) {
            return false;
        }
    }

    public async delete(): Promise<boolean> {
        try {
            await this.#streams.http.deleteStream(this.#stream.id);
            return true;
        } catch (e) {
            return false;
        }
    }

    protected unserialize(stream: IStream<ID>) {
        let fields   = Object.entries(stream.fields || {}).map(([ key, field ]) => {
            if ( isFieldData(field) ) {
                return [ key, new Field(field) ];
            }
            if ( typeof field === 'string' ) {
                return [ key, new Field({ type: field }) ];
            }
            throw new Error(`Could not unserialize stream "${this.handle}" because of field [${key}] with value ${field}`);
        }).reduce(objectify, {});
        this.#fields = new FieldCollection(fields);
    }

    public serialize(): IStream<ID> {
        let stream    = deepmerge({}, this.#stream, { clone: true });
        stream.fields = Object
        .entries(this.getFields().toObject())
        .map(([ id, field ]) => [ id, field.serialize() ])
        .reduce(objectify, {});

        return stream;
    }

}
