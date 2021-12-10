import { FieldData } from '../Field';
import { streams } from './generated';

export interface IStreamMeta {
    parameters: Record<string, string>;
    query: string[];
}

export type IStreamLinks<K> = {
    [T in keyof K]: string
}

export interface IStreamResponse<T extends any = any, META extends IStreamMeta = IStreamMeta, LINKS = IStreamLinks<'self' | 'entries'>> {
    data: T;
    meta: META;
    links: LINKS;
    errors?: string[] | Record<string, string | string[]>;
}

export type IStreamPost<T, ID extends streams.StreamID = streams.StreamID> =
    IBaseStream<ID>
    & T;

export interface IBaseStream<ID extends streams.StreamID=streams.StreamID> {
    id?: ID
    created_at?: string
    updated_at?: string
    name: string
    description: string
    source: {
        type: string
        [ key: string ]: any
    },
    fields?: Record<string, fields.Type|FieldData>
    rules?: Record<string, string | object | string[]>
    [ key: string ]: any
}


export interface IStream<ID extends streams.StreamID = streams.StreamID> extends IBaseStream<ID> {
    handle?: ID
    routes?: Array<any>,
    validators?: Array<any>,
    config?: Record<string, any>
}


export namespace fields {
    export interface Types {
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
    }

    export type Type = keyof Types
}
