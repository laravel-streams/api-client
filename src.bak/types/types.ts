import { FetchRequest } from '../FetchRequest';
import { Client } from '../Client';

export type Constructor<Type = any> = new (...args: any[]) => Type

export type ToRecord<K> = {
    [T in keyof K]: string
}

export type RequestMiddleware = (this:Client,request: FetchRequest) => Promise<FetchRequest>
export type ResponseMiddleware = (this:Client,response: ClientResponse) => Promise<ClientResponse>

export type ResponseType =
    'arraybuffer'
    | 'document'
    | 'json'
    | 'text'
    | 'stream'
    | 'blob'

export interface RequestConfig extends RequestInit {
    uri?: string;
    responseType?:ResponseType
    // query parameters
    query?:any
    // json payload
    data?:any
}

export interface ClientResponse<T=any> extends Response {
    request: FetchRequest;
    data:T
}

export interface GetEntriesQuery {
    order_by?:Record<string,any>
    where?: Record<string,any>
    constraint?: Record<string,any>
    per_page?: number
    page?: number
    limit?: number
    skip?: number
}