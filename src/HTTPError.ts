
export class HTTPError extends Error {
    constructor(public response: Response) {
        super(`HTTP ${response.status} Error: ${response.statusText}`);
        this.name = 'HTTPError';
    }
}
