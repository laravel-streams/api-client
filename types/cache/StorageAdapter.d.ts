import { StorageAdapterInterface } from './StorageAdapterInterface';
import { Streams } from '../Streams';
import { ETagConfiguration } from '../types';
export declare class StorageAdapter implements StorageAdapterInterface {
    protected streams: Streams;
    protected storage: Storage;
    get config(): ETagConfiguration;
    constructor(streams: Streams, storage?: Storage);
    get<T>(key: string, defaultValue?: T): T;
    has(key: string): boolean;
    set(key: string, value: any): this;
    unset(key: string): this;
    clear(): this;
}
