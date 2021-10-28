export interface ApiError {
    message: string;
    meta?: {
        field?: string;
    };
}
export interface ApiMeta<T extends keyof any = any> {
    parameters: Record<T, string>;
}
export interface ApiPayloadMeta<T = any, P extends keyof any = any> extends ApiMeta<P> {
    payload: T;
}
export interface ApiQueryMeta extends ApiMeta {
    query: Record<string, any>;
}
export interface EmptyApiResponse {
}
export interface BaseApiResponse {
    errors?: ApiError[];
}
export interface ApiErrorResponse<T extends ApiMeta = ApiMeta> extends BaseApiResponse {
    meta: T;
}
export interface ApiErrorResponse extends BaseApiResponse {
}
export interface ApiDataResponse<DATA = any, PARAMS extends keyof any = any, LINKS extends ApiLinks = ApiLinks, META extends ApiMeta = ApiPayloadMeta<DATA, PARAMS>> extends BaseApiResponse {
    meta: META;
    links: LINKS;
    data: DATA;
}
export declare type ApiResponse = BaseApiResponse | EmptyApiResponse | ApiErrorResponse | ApiDataResponse;
import ApiLinks = links.Links;
export { ApiLinks };
declare namespace links {
    type ApiLinks<K extends keyof any> = {
        [P in K]: string;
    };
    interface EntriesLinks {
        create: 'self' | 'location' | 'stream' | 'entries';
        delete: 'self' | 'streams' | 'stream' | 'entries';
        get: 'self' | 'stream' | 'streams';
        paginated: 'self' | 'stream' | 'streams' | 'first_page' | 'next_page' | 'previous_page';
        patch: 'self' | 'streams' | 'stream' | 'entries';
        show: 'self' | 'stream' | 'entries';
        update: 'self' | 'stream' | 'entries';
    }
    type EntriesApiLinks<K extends keyof EntriesLinks> = ApiLinks<EntriesLinks[K]>;
    interface StreamsLinks {
        create: 'self' | 'streams' | 'location';
        delete: 'self' | 'streams';
        get: 'self';
        paginated: 'self' | 'first_page' | 'next_page' | 'previous_page';
        patch: 'self' | 'streams' | 'entries';
        show: 'self' | 'streams' | 'entries';
        update: 'self' | 'streams' | 'entries';
    }
    type StreamsApiLinks<K extends keyof StreamsLinks> = ApiLinks<StreamsLinks[K]>;
    interface EndpointLinks {
        entries: EntriesLinks;
        streams: StreamsLinks;
    }
    type Links<ENDPOINT extends keyof EndpointLinks = keyof EndpointLinks, METHOD extends keyof EndpointLinks[ENDPOINT] = keyof EndpointLinks[ENDPOINT]> = Partial<Record<EndpointLinks[ENDPOINT][METHOD], string>>;
}
