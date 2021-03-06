import { RequestConfig } from './api';
import { Streams } from '../Streams';
import { StorageAdapterInterface } from '../cache';

export interface ETagConfiguration {
    enabled?: boolean;
    manifestKey?: string;
    compression?: boolean;
    StorageAdapter?: new (streams: Streams, storage: Storage) => StorageAdapterInterface;
}

export interface StreamsConfiguration {
    baseURL: string;
    request?: RequestConfig;
    etag?: ETagConfiguration;
}

export interface IBaseEntry {
    [ key: string ]: any;
}

export interface IBaseStreamConfig {
    key_name: string,
    cache?: {
        enabled?: boolean
        ttl?: number
        store?: string
    }
    source: {
        adapter?: 'database' | 'eloquent' | 'file' | 'filebase' | 'self' | string

        type: 'database' | 'eloquent' | 'file' | 'filebase' | 'self' | string
        /** When using `database` adapter */
        connection?: string
        /** When using `database` adapter */
        table?: string
        /** When using `eloquent` adapter */
        model?: string
        /** When using `file`, `filebase` or `self` adapter */
        format?: 'json' | 'php' | 'yaml' | 'md' | 'tpl'
        /** When using the `filebase` adapter, path to directory */
        path?: string
        /** When using the `file` adapter, path to file */
        file?: string

        [ key: string ]: any
    }
    meta?: {
        key_name?: string
    }
    /** FQN of the abstract class to use */
    abstract?: string
    /** FQN of the collection class to use */
    collection?: string
    /** FQN of the criteria class to use */
    criteria?: string
    /** FQN of the repository class to use */
    repository?: string
    /** FQN of the factory class to use */
    factory?: string
    /** FQN of the schema class to use */
    schema?: string

    [ key: string ]: any;
}

export interface IBaseStream<ID = any> {
    id?: ID
    handle?: ID
    created_at?: string
    updated_at?: string
    name: string
    description: string
    fields?: IStreamFields
    routes?: Array<any>,
    validators?: Array<any>,
    config?: IBaseStreamConfig
    entries?: IBaseEntry[];

    [ key: string ]: any;
}

export interface IEntries {
    [ key: string ]: any;
}

export interface IStreams {
    [ key: string ]: any;
}

export type StreamID = keyof IStreams

export interface IBaseFieldConfig {
    default?: any;

    [ key: string ]: any;
}

export interface IBaseField<T extends FieldType = FieldType> {
    handle?: string;
    type: T;
    input?: Record<string, any> & {
        type: T
    };
    rules?: any[];
    config?: IBaseFieldConfig;

    [ key: string ]: any;
}

export type IStreamFields = Record<string, IBaseField | FieldType>

export interface FieldTypes {
    string: string;
    url: string;
    text: string;
    hash: string;
    slug: string;
    email: string;
    markdown: string;
    template: string;
    number: number;
    integer: number;
    float: number;
    decimal: number;
    boolean: boolean;
    array: Array<any>;
    prototype: object;
    object: object;
    image: any;
    file: any;
    datetime: string;
    date: string;
    time: string;
    select: string;
    multiselect: string[];
    collection: Array<any>;
    entry: any;
    entries: any;
    multiple: any;
    polymorphic: any;
    relationship: any;
    color: any;

    [ key: string ]: any;
}

export type FieldType = keyof FieldTypes
