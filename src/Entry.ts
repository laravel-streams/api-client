import { Http } from './Http';
import {  Stream } from './Stream';
// export interface Entry<ID extends string = string> {
//     id: string;
// }
export type IEntry<T, ID extends string = string> =
    Entry<ID>
    & T;

export class Entry<ID extends string = string> {
    get http(): Http {return this._stream.streams.http;}

    constructor(
        protected _stream: Stream<ID>,
        protected _data: any      = {},
        protected _fresh: boolean = true,
    ) {
        let proxy = new Proxy(this, {
            get(target: Entry<ID>, p: string | symbol, receiver: any): any {
                if ( Reflect.has(target, p) ) {
                    return Reflect.get(target, p, receiver);
                }
                if ( Reflect.has(target._data, p) ) {
                    return Reflect.get(target._data, p);
                }
            },
            set(target: Entry<ID>, p: string | symbol, value: any, receiver: any): boolean {
                if ( Reflect.has(target, p) ) {
                    return Reflect.set(target, p, value, receiver);
                }
                return Reflect.set(target._data, p, value);
            },
        });
        return proxy;
        // Object.assign(this,_data)
    }

    get stream(): Stream<ID> {
        return this._stream;
    }

    async save(): Promise<boolean> {
        try {
            if ( this._fresh ) {
                await this.http.postEntry(this._stream.id, this._data);
                return true;
            }
            await this.http.patchEntry(this._stream.id, this._data.id, this._data);
            return true;
        } catch (e) {
            return false;
        }
    }

    validator() {

    }

}
