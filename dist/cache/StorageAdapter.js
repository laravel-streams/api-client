import { Transformer } from './Transformer';
export class StorageAdapter {
    constructor(streams, storage = localStorage) {
        this.streams = streams;
        this.storage = storage;
    }
    get config() { return this.streams.config.etag; }
    get(key, defaultValue) {
        if (!this.has(key)) {
            return defaultValue;
        }
        let strValue = this.storage.getItem(key);
        if (this.config.compression) {
            strValue = Transformer.decompress(strValue);
        }
        return Transformer.decode(strValue);
    }
    has(key) {
        return !!this.storage.getItem(key);
    }
    set(key, value) {
        let strValue = Transformer.encode(value);
        if (this.config.compression) {
            strValue = Transformer.compress(strValue);
        }
        this.storage.setItem(key, strValue);
        return this;
    }
    unset(key) {
        this.storage.removeItem(key);
        return this;
    }
    clear() {
        this.storage.clear();
        return this;
    }
}
