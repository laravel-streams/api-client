import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestHeaders } from './headers';

export type URLSearchParamsFunctionName = keyof URLSearchParams
export type URLSearchParamsInit =
    string[][]
    | Record<string, string>
    | string
    | URLSearchParams

export interface RequestConfig<D = any> extends Omit<AxiosRequestConfig<D>,'headers'> {
    headers?:RequestHeaders
}
export type Constructor<Type = any> = new (...args: any[]) => Type


export interface StreamsConfiguration {
    baseURL:string
    request?:RequestConfig
}



export interface Response<T=any, D=any> extends AxiosResponse<T,D>{

}

export interface ResponseError {
    message: string;
    meta?: {
        field?: string
    };
}


namespace links {
    export type ApiLinks<K extends keyof any> = { [P in K]: string }

    export interface EntriesLinks {
        create: 'self' | 'location' | 'stream' | 'entries';
        delete: 'self' | 'streams' | 'stream' | 'entries';
        get: 'self' | 'stream' | 'streams';
        paginated: 'self' | 'stream' | 'streams' | 'first_page' | 'next_page' | 'previous_page';
        patch: 'self' | 'streams' | 'stream' | 'entries';
        show: 'self' | 'stream' | 'entries';
        update: 'self' | 'stream' | 'entries';
    }

    export type EntriesApiLinks<K extends keyof EntriesLinks> = ApiLinks<EntriesLinks[K]>

    export interface StreamsLinks {
        create: 'self' | 'streams' | 'location';
        delete: 'self' | 'streams';
        get: 'self';
        paginated: 'self' | 'first_page' | 'next_page' | 'previous_page';
        patch: 'self' | 'streams' | 'entries';
        show: 'self' | 'streams' | 'entries';
        update: 'self' | 'streams' | 'entries';
    }

    export type StreamsApiLinks<K extends keyof StreamsLinks> = ApiLinks<StreamsLinks[K]>

    export interface EndpointLinks {
        entries: EntriesLinks;
        streams: StreamsLinks;
    }

    export type Links<ENDPOINT extends keyof EndpointLinks = keyof EndpointLinks,
        METHOD extends keyof EndpointLinks[ENDPOINT] = keyof EndpointLinks[ENDPOINT]
        // @ts-ignore
        > = Partial<Record<EndpointLinks[ENDPOINT][METHOD], string>>;
    // @ts-ignore
    // export type Links<// @ts-ignore
    //     ENDPOINT extends keyof EndpointLinks = EndpointLinks,
    //     // @ts-ignore
    //     METHOD extends keyof EndpointLinks[ENDPOINT] = EndpointLinks[ENDPOINT]
    //     // @ts-ignore
    //     > = ApiLinks<EndpointLinks[ENDPOINT][METHOD]>
    let links: Links<'streams', 'paginated'>;

    // let l:Link<'entries','create'>

}
