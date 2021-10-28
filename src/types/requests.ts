export type MethodName = keyof typeof Method

export enum Method {
    connect = 'CONNECT',
    delete  = 'DELETE',
    get     = 'GET',
    head    = 'HEAD',
    options = 'OPTIONS',
    patch   = 'PATCH',
    post    = 'POST',
    put     = 'PUT',
    trace   = 'TRACE',
}


export type URLSearchParamsFunctionName = keyof URLSearchParams
export type URLSearchParamsInit =
    string[][]
    | Record<string, string>
    | string
    | URLSearchParams


export interface ClientConfiguration {
    baseURL: string;
    headers?: Record<string, string>;
    request?: RequestConfig;

}

export type Constructor<Type = any> = new (...args: any[]) => Type


export interface ApiConfiguration extends ClientConfiguration {

    Client?: Constructor<any>;
    Http?: Constructor<any>;
}

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream'

export interface RequestConfig extends RequestInit {
    params?: Record<string, any>;
    url?: string;
    method?: MethodName | Method;
    data?: any;
    responseType?: ResponseType;
    /**
     * If response.ok === false then
     * throw: an {@see import('./HTTPError').HTTPError}
     * include: response.error will be {@see import('./HTTPError').HTTPError}
     */
    errorHandling?: 'throw' | 'include';
}

