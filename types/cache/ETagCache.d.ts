import { StorageAdapterInterface } from './StorageAdapterInterface';
import { Streams } from '../Streams';
export interface ETagCacheValue {
    etag: string;
    value: any;
}
export declare class ETagCache {
    protected streams: Streams;
    storage: StorageAdapterInterface;
    constructor(streams: Streams, storage: StorageAdapterInterface);
    get manifestKey(): string;
    get(key: string): ETagCacheValue | undefined;
    set(key: string, etag: string, value: any): StorageAdapterInterface;
    reset(): void;
    protected getUuidManifest(): string[];
    protected addToUuidManifest(uuid: any): void;
}
