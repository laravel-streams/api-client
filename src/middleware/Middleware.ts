import { Client } from '../Client';
import { FetchRequest } from '../fetch/FetchRequest';
import { ClientResponse } from '../types';
import { RequestError } from '../RequestError';


export abstract class Middleware {
    request?(request: FetchRequest, client:Client): Promise<FetchRequest>

    response?(response: ClientResponse,client:Client): Promise<ClientResponse>
    error?(error: RequestError,client:Client): void
}