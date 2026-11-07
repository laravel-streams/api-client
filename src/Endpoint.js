import { Resource } from './Resource.js';

/**
 * HTTP verbs an endpoint resource can issue.
 */
const VERBS = ['get', 'post', 'patch', 'put', 'delete'];

/**
 * Substitute {param} placeholders in a URI template with the given values.
 *
 * @param {string} uri - URI template containing {param} placeholders.
 * @param {string} name - Endpoint name, used in error messages.
 * @param {Record<string, unknown>} params - Values to substitute.
 * @returns {string} The resolved URI.
 * @throws {Error} When a placeholder has no matching path parameter.
 */
function substitute(uri, name, params) {
    return uri.replace(/\{([^}]+)\}/g, (match, key) => {
        const value = params[key];
        if (value === undefined || value === null) {
            throw new Error(
                `Missing path parameter "${key}" for endpoint "${name}". ` +
                `Pass it as { ${key}: value } or via config.params.`
            );
        }
        return encodeURIComponent(value);
    });
}

/**
 * Callable resource bound to a registered endpoint definition.
 *
 * Calls go through Client.request with {param} placeholders in the
 * registered URI substituted, so the client's middleware stack and request
 * policy (retry, abort, timeout) apply exactly as they do for streams and
 * entries calls.
 */
export class Endpoint extends Resource {
    constructor(client, definition) {
        super(client);
        this.name = definition.name;
        this.method = String(definition.method).toLowerCase();
        this.uri = definition.uri;
        this.responseType = definition.responseType;
    }

    /**
     * Make the request using the endpoint's registered HTTP method.
     *
     * @param {Record<string, unknown>} [params] - Path parameters to substitute.
     * @param {object} [config] - Request config (data, query, signal, retries, ...).
     */
    async call(params = {}, config = {}) {
        return this._request(this.method, params, config);
    }

    /**
     * Issue a request against the endpoint URI with path params substituted.
     */
    _request(method, params = {}, config = {}) {
        const uri = substitute(this.uri, this.name, { ...(config.params || {}), ...params });
        const { params: _unused, ...rest } = config;
        return this.client.request(method, uri, rest);
    }
}

// Expose each HTTP verb as a convenience method on the endpoint resource.
for (const verb of VERBS) {
    Endpoint.prototype[verb] = function (params = {}, config = {}) {
        return this._request(verb, params, config);
    };
}
