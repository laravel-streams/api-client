export declare class HTTPError extends Error {
    response: Response;
    request?: Request;
    constructor(response: Response, request?: Request);
}
