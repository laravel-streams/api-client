import { FieldData } from '../Field';
import { IBaseStream, StreamID, IStreams } from './generated';

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

export type IStreamPost<T, ID extends StreamID = StreamID> =
    IBaseStream<ID>
    & T;

export interface IStream<ID extends StreamID=StreamID> extends IBaseStream<ID> {

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
        [key:string]:any
    }

    export type Type = keyof Types
}
