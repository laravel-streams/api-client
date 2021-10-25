
export class HTTPError extends Error {
    constructor(public response: Response, public request?:Request) {
        super(`HTTP ${response.status} Error: ${response.statusText}`);
        this.name = 'HTTPError';
    }
}
