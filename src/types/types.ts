import { FetchRequest } from '../fetch/FetchRequest';
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
}

export interface ClientResponse<T=any> extends Response {
    request: FetchRequest;
    data:T
}