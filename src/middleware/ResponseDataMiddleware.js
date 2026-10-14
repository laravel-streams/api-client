import { Middleware } from './Middleware.js';

/**
 * Middleware to parse response data based on responseType
 */
export class ResponseDataMiddleware extends Middleware {
    static defaultOptions = { priority: { response: 40 } };

    async response(response, client) {
        const request = response.request;
        if (response.status === 204 || response.status === 205 || response.status === 304 || request.method === 'HEAD') {
            response.data = null;
            return response;
        }
        
        if (request.isResponseType('arraybuffer')) {
            response.data = await response.arrayBuffer();
        } else if (request.isResponseType('blob')) {
            response.data = await response.blob();
        } else if (request.isResponseType('document')) {
            response.data = await response.formData();
        } else if (request.isResponseType('json')) {
            const text = await response.text();
            let parsed = null;
            try {
                parsed = text ? JSON.parse(text) : null;
            } catch (error) {
                if (response.ok) throw error;
                // Preserve the HTTP failure even when a proxy returns a non-JSON body.
                response.data = text;
                return response;
            }
            response.envelope = parsed;
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)
                && Object.hasOwn(parsed, 'data') && (Object.hasOwn(parsed, 'meta')
                    || Object.hasOwn(parsed, 'links') || Object.hasOwn(parsed, 'errors'))) {
                response.data = parsed.data;
                response.meta = parsed.meta;
                response.links = parsed.links;
                response.errors = parsed.errors;
            } else {
                response.data = parsed;
            }
        } else if (request.isResponseType('stream')) {
            response.data = await response.body;
        } else if (request.isResponseType('text')) {
            response.data = await response.text();
        }
        
        return response;
    }
}
