import { AxiosRequestConfig } from 'axios';
import { RequestHeaders } from './headers';
import { IBaseStream, StreamID } from './streams';

//@ts-node
export interface RequestConfig<D = any> extends Omit<AxiosRequestConfig<D>, 'headers'> {
    headers?: RequestHeaders;
}


export interface ApiError {
    message: string;
    meta?: {
        field?: string
    };
}

export interface BaseApiResponse {
    errors?: string[] | Record<string, string | string[]> | ApiError[];
}

export interface ApiDataResponse<DATA = any,
    ENDPOINT extends keyof links.EndpointLinks = keyof links.EndpointLinks,
    M extends meta.Method = meta.Method,
    LINKS extends links.Links<ENDPOINT, M> = links.Links<ENDPOINT, M>,
    PARAMS extends keyof any = any,
    META extends ApiMeta<M, PARAMS> = ApiMeta<M, PARAMS>> extends BaseApiResponse {
    meta: META;
    links: LINKS;
    data: DATA;
}

let a: ApiDataResponse<{ a: string }, 'entries', 'get'>;


export type IStreamPost<T, ID extends StreamID = StreamID> =
    IBaseStream<ID>
    & T;

export interface IStream<ID extends StreamID = StreamID> extends IBaseStream<ID> {

}

namespace meta {
    export interface List {
        total: number;
        per_page: number;
        last_page: number;
        current_page: number;
        stream?: string;
    }

    export interface Post {
        stream: string;
        payload?: any;
    }

    export interface Get {
        total: number;
        per_page: number;
        last_page: number;
        current_page: number;
        stream?: string;
    }

    export interface Put {
        stream: string;
        entry: string;
        payload?: any;
    }

    export interface Patch {
        stream: string;
        entry: string;
        payload?: any;
    }

    export interface Meta {
        list: List;
        post: Post;
        get: Get;
        put: Put;
        patch: Patch;
    }

    export type Method = keyof Meta
}

export type ApiMeta<M extends meta.Method, PARAMS extends keyof any = any> =
    meta.Meta[M]
    & {
        parameters: Record<PARAMS, string>;
        query: string[];
    }

namespace links {

    export interface Entries {
        list: 'self' | 'stream' | 'first_page' | 'next_page' | 'previous_page';
        post: 'self' | 'location' | 'stream' | 'entries';
        get: 'self' | 'stream' | 'entries';
        put: 'self' | 'stream' | 'entries';
        patch: 'self' | 'streams' | 'stream' | 'entries';
    }

    // paginated: 'self' | 'first_page' | 'next_page' | 'previous_page';
    export interface Streams {
        list: 'self' | 'stream' | 'first_page' | 'next_page' | 'previous_page';
        post: 'self' | 'location' | 'stream' | 'entries';
        get: 'self' | 'stream' | 'entries';
        put: 'self' | 'stream' | 'entries';
        patch: 'self' | 'streams' | 'stream' | 'entries';
    }


    export interface EndpointLinks {
        entries: Entries;
        streams: Streams;
    }

    export type Links<ENDPOINT extends keyof EndpointLinks = keyof EndpointLinks,
        METHOD extends keyof EndpointLinks[ENDPOINT] = keyof EndpointLinks[ENDPOINT],
        // @ts-ignore
        VALUE extends string = EndpointLinks[ENDPOINT][METHOD]> = Partial<Record<VALUE, string>>;

}
import ApiLinks = links.Links;

export { ApiLinks };
