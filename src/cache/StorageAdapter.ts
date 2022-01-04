import { StorageAdapterInterface } from './StorageAdapterInterface';
import { Transformer } from './Transformer';
import { Streams } from '../Streams';
import { ETagConfiguration } from '../types';

export class StorageAdapter implements StorageAdapterInterface {

    get config():ETagConfiguration{return this.streams.config.etag}

    constructor(protected streams: Streams, protected storage: Storage = localStorage) {

    }

    public get<T>(key: string, defaultValue?: T): T {
        if ( !this.has(key) ) {
            return defaultValue;
        }
        let strValue = this.storage.getItem(key);
        if(this.config.compression) {
            strValue = Transformer.decompress(strValue);
        }
        return Transformer.decode(strValue);
    }

    public has(key: string): boolean {
        return !!this.storage.getItem(key);
    }

    public set(key: string, value: any): this {
        let strValue = Transformer.encode(value);
        if(this.config.compression) {
            strValue = Transformer.compress(strValue);
        }
        this.storage.setItem(key, strValue);
        return this;
    }

    public unset(key: string): this {
        this.storage.removeItem(key);
        return this;
    }

    public clear() {
        this.storage.clear();
        return this;
    }
}
