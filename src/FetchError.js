/**
 * Custom error for HTTP fetch failures
 */
export class FetchError extends Error {
    constructor(request) {
        super(`HTTP ${request.response.status} error:\n ${request.response.statusText}`);
        this.request = request;
        this.status = request.response.status;
        this.statusText = request.response.statusText;
        this.url = request.response.url;
    }

    get response() {
        return this.request.response;
    }
}
