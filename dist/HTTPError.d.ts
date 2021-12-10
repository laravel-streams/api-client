import { ClientResponse } from './Client';
export declare class HTTPError extends Error {
    response: ClientResponse;
    constructor(response: ClientResponse);
}
