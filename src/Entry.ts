import { Stream } from './Stream';
import { IStreams, StreamID } from './types';
import { Obj } from './utils';

export type IEntry<ID extends StreamID = StreamID> =
    Entry<ID>
    & IStreams[ID]['entries'];



export class Entry<ID extends StreamID = StreamID> {
    #stream: Stream<ID>;
    #data: IStreams[ID]['entries'] = {};
    #fresh: boolean               = true;

    constructor(
        stream: Stream<ID>,
        data: any      = {},
        fresh: boolean = true,
    ) {
        this.#stream = stream;
        this.#data   = data;
        this.#fresh  = fresh;
        const self   = this;
        let proxy    = new Proxy(this, {
            get: (target: Entry<ID>, p: string | symbol, receiver: any): any => {
                if ( typeof self[ p.toString() ] === 'function' ) {
                    return self[ p.toString() ].bind(self);
                }
                if ( self[ p.toString() ] !== undefined ) {
                    return self[ p.toString() ];
                }
                if ( Reflect.has(target.#data, p) ) {
                    return Reflect.get(target.#data, p);
                }
                if ( Reflect.has(target, p) ) {
                    return Reflect.get(target, p, receiver);
                }
            },
            set: (target: Entry<ID>, p: string | symbol, value: any, receiver: any): boolean => {
                if ( Reflect.has(target, p) ) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(target.#data, p, value);
            },
        });
        return proxy;
    }

    public getStream(): Stream<ID> {return this.#stream; }

    public async save(): Promise<boolean> {
        let http = this.#stream.getStreams().http;
        try {
            if ( this.#fresh ) {
                await http.postEntry(this.#stream.id, this.#data);
                this.#fresh = false;
                return true;
            }
            await http.patchEntry(this.#stream.id, this.#data.id, this.getPatchData());
            return true;
        } catch (e) {
            return false;
        }
    }

    protected getPatchData(){
        let data=this.toObject();
        if(this.#stream?.config?.key_name) {
            return Obj.exclude(data, [ this.#stream.config.key_name ])
        }
        return data;
    }

    toObject(): IStreams[ID]['entries'] {
        return this.#data;
    }
}
