/**
 * Custom error for HTTP fetch failures
 */
export class FetchError extends Error {
    constructor(request) {
        super(`HTTP ${request.response.status} error:\n ${request.response.statusText}`);
        this.name = 'FetchError';
        this.request = request;
        this.status = request.response.status;
        this.statusText = request.response.statusText;
        this.url = request.response.url;
        this.errors = {};
    }

    async mapValidationErrors() {
        if (this.status !== 422) return this;
        try {
            // Preserve the original body for error middleware and callers.
            const data = await this.response.clone().json();
            this.data = data;
            if (typeof data?.message === 'string') this.message = data.message;
            if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
                this.errors = data.errors;
            }
        } catch {
            // Non-JSON validation responses remain ordinary HTTP errors.
        }
        return this;
    }

    get response() {
        return this.request.response;
    }
}
