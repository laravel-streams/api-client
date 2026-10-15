
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "Auth", () => $012108e7c81b27fa$export$334c29725a78c21d);
$parcel$export(module.exports, "Client", () => $8921af6a8136d8e3$export$1f2bb630327ac4b6);
$parcel$export(module.exports, "Criteria", () => $67738b032127bbc4$export$9bcb229a699e7da1);
$parcel$export(module.exports, "Entries", () => $4bb31526c70c167d$export$be81f2ab9a4121eb);
$parcel$export(module.exports, "FetchError", () => $c2f1aeaaba3e9a7d$export$26e841bcf1aeb894);
$parcel$export(module.exports, "FetchHeaders", () => $98e2fd03a3ce98b4$export$b0074bfbbf5cfe5c);
$parcel$export(module.exports, "FetchRequest", () => $1db99460b351f96f$export$319b96fe59834522);
$parcel$export(module.exports, "Resource", () => $34d0bca0da7ee085$export$39a853cfb5a94a63);
$parcel$export(module.exports, "Streams", () => $0c1e8edf525968d2$export$8ee3a38db681f49d);
$parcel$export(module.exports, "MemoryTokenStorage", () => $2354d111a4ca800f$export$3eea21c5b25eb11d);
$parcel$export(module.exports, "WebStorageTokenStorage", () => $2354d111a4ca800f$export$621255c1835a0665);
$parcel$export(module.exports, "createTokenStorage", () => $2354d111a4ca800f$export$b40ecb0ca14d8c82);
$parcel$export(module.exports, "secureStorageAdapter", () => $2354d111a4ca800f$export$ec8b0aa9e541d550);
$parcel$export(module.exports, "AuthorizationMiddleware", () => $cbc2e4173dc2f076$export$6e29424e2d1846ed);
$parcel$export(module.exports, "CriteriaMiddleware", () => $1b87c2c0b7f5abad$export$b79367ae2b118768);
$parcel$export(module.exports, "ETagMiddleware", () => $c272e73d90bc0a59$export$faa9a44a513b92c4);
$parcel$export(module.exports, "OrganizationMiddleware", () => $bd7c22ec2501a222$export$4c5ce066ae8189e1);
$parcel$export(module.exports, "Middleware", () => $39d6e140d9c03804$export$7dc23e3ab61f5f49);
$parcel$export(module.exports, "QueryMiddleware", () => $cb618720e3539df9$export$a74cfeef44e69e22);
$parcel$export(module.exports, "RequestDataMiddleware", () => $db0116cc62677c9f$export$81bc91ba859dba8e);
$parcel$export(module.exports, "ResponseDataMiddleware", () => $30421c5a2897c231$export$60dea4b97ea2ef30);
/**
 * String utility class
 */ class $4559ecf940edc78d$export$ed61451db706e904 {
    static random(length = 15) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < length; i++)text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    static ensureLeft(str, left) {
        if (!str.startsWith(left)) return left + str;
        return str;
    }
    static ensureRight(str, right) {
        if (!str.endsWith(right)) return str + right;
        return str;
    }
    static stripLeft(str, left) {
        if (str.startsWith(left)) return str.substring(left.length);
        return str;
    }
    static stripRight(str, right) {
        if (str.endsWith(right)) return str.substring(0, str.length - right.length);
        return str;
    }
    static ucfirst(string) {
        return string[0].toUpperCase() + string.slice(1);
    }
    static lcfirst(string) {
        return string[0].toLowerCase() + string.slice(1);
    }
    static parameters(str, params) {
        Object.entries(params).forEach(([key, value])=>{
            str = str.replace(new RegExp(':' + key, 'g'), value);
        });
        return str;
    }
}
const $4559ecf940edc78d$export$92b78acdbe066b6b = (obj, [k, v])=>({
        ...obj,
        [k]: v
    });
function $4559ecf940edc78d$export$f09552f0f3c8e6f7(params) {
    return encodeURIComponent(btoa(JSON.stringify(params)));
}
const $4559ecf940edc78d$export$2321aea138b44780 = (target, ...sources)=>{
    if (!sources.length) return target;
    const source = sources.shift();
    if (source === undefined) return target;
    if ($4559ecf940edc78d$var$isMergeableObject(target) && $4559ecf940edc78d$var$isMergeableObject(source)) Object.keys(source).forEach(function(key) {
        if ($4559ecf940edc78d$var$isMergeableObject(source[key])) {
            if (!target[key]) target[key] = {};
            $4559ecf940edc78d$export$2321aea138b44780(target[key], source[key]);
        } else target[key] = source[key];
    });
    return $4559ecf940edc78d$export$2321aea138b44780(target, ...sources);
};
const $4559ecf940edc78d$export$a6cdc56e425d0d0a = (item)=>{
    return item !== null && typeof item === 'object';
};
/**
 * Check if object is mergeable
 */ const $4559ecf940edc78d$var$isMergeableObject = (item)=>{
    return $4559ecf940edc78d$export$a6cdc56e425d0d0a(item) && (Object.getPrototypeOf(item) === Object.prototype || Object.getPrototypeOf(item) === null);
};
function $4559ecf940edc78d$export$f81ea438226eca0a(obj = {}) {
    const map = new class extends Map {
        toObject() {
            return Array.from(this.entries()).map((kv)=>[
                    kv[0],
                    kv[1]
                ]).reduce($4559ecf940edc78d$export$92b78acdbe066b6b, {});
        }
        toKeys() {
            return Array.from(this.keys());
        }
        merge(obj) {
            obj = $4559ecf940edc78d$export$2321aea138b44780(this.toObject(), obj);
            Object.entries(obj).forEach(([k, v])=>this.set(k, v));
            return this;
        }
        empty() {
            return this.size === 0;
        }
    }();
    map.merge(obj);
    return map;
}
function $4559ecf940edc78d$export$fac44ee5b035f737(obj, options = {}) {
    const encodeValuesOnly = options.encodeValuesOnly !== false;
    const encode = (str)=>{
        if (encodeValuesOnly) return String(str);
        return encodeURIComponent(str);
    };
    const buildParams = (prefix, value)=>{
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return value.map((v, i)=>buildParams(`${prefix}[${i}]`, v)).join('&');
        if (typeof value === 'object') return Object.keys(value).map((key)=>buildParams(`${prefix}[${key}]`, value[key])).join('&');
        return `${prefix}=${encode(value)}`;
    };
    return Object.keys(obj).map((key)=>{
        const value = obj[key];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value) || typeof value === 'object') return buildParams(key, value);
        return `${key}=${encode(value)}`;
    }).filter(Boolean).join('&');
}


class $39d6e140d9c03804$export$7dc23e3ab61f5f49 {
    static defaultOptions = {
        priority: {
            request: 50,
            response: 50,
            error: 50
        }
    };
    constructor(options = {}){
        this.options = this.constructor.getDefaultOptions(this.constructor, options);
    }
    /**
     * Get middlewares for a specific kind sorted by priority
     */ static get(middlewares, kind) {
        return middlewares.filter((middleware)=>typeof middleware[kind] === 'function').sort((a, b)=>{
            return a.options.priority[kind] - b.options.priority[kind];
        });
    }
    /**
     * Run all middlewares of a specific kind
     */ static async run(client, target, kind) {
        const middlewares = $39d6e140d9c03804$export$7dc23e3ab61f5f49.get(client.middlewares, kind);
        for (const middleware of middlewares)target = await middleware[kind](target, client);
        return target;
    }
    /**
     * Get default options with inheritance
     */ static getDefaultOptions(t, options = {}) {
        if ((0, $4559ecf940edc78d$export$a6cdc56e425d0d0a)(t.defaultOptions)) options = (0, $4559ecf940edc78d$export$2321aea138b44780)(t.defaultOptions, options);
        let parent = Object.getPrototypeOf(t);
        if (parent && (0, $4559ecf940edc78d$export$a6cdc56e425d0d0a)(parent.defaultOptions)) options = this.getDefaultOptions(parent, options);
        return options;
    }
    /**
     * Set priority for middleware execution
     */ priority(priority, kind = false) {
        let kinds = [
            'request',
            'response',
            'error'
        ];
        kind = kind !== undefined && kinds.includes(kind?.toString()) ? kind : false;
        if (!kind) kinds.forEach((kind)=>this.options[kind] = priority);
        else this.options[kind] = priority;
        return this;
    }
}


class $cbc2e4173dc2f076$export$6e29424e2d1846ed extends (0, $39d6e140d9c03804$export$7dc23e3ab61f5f49) {
    constructor(options = {}){
        const { token: token = null, type: type = 'Bearer', storage: storage = null, onUnauthorized: onUnauthorized = null, priority: priority, ...rest } = options;
        super(rest);
        this.token = $cbc2e4173dc2f076$var$normalizeToken(token);
        this.type = type || 'Bearer';
        this.storage = storage;
        this.onUnauthorized = typeof onUnauthorized === 'function' ? onUnauthorized : null;
        this.unauthorizedNotified = false;
        this.hydrated = this.token != null || storage == null;
        this.epoch = 0;
        this.hydrating = null;
        // RequestDataMiddleware and QueryMiddleware rebuild the request at
        // priority 50. Run after them so the header survives that rebuild.
        this.options = {
            ...this.options,
            priority: {
                request: priority?.request ?? 60,
                response: priority?.response ?? this.options?.priority?.response ?? 50,
                error: priority?.error ?? this.options?.priority?.error ?? 50
            }
        };
    }
    setOnUnauthorized(handler) {
        this.onUnauthorized = typeof handler === 'function' ? handler : null;
        return this;
    }
    async setToken(token, type = 'Bearer') {
        this.type = type || 'Bearer';
        return this.commit($cbc2e4173dc2f076$var$normalizeToken(token));
    }
    async clearToken() {
        return this.commit(null);
    }
    async request(request) {
        if (request?.authorization === false) {
            request.headers.delete('Authorization');
            return request;
        }
        const token = await this.currentToken();
        if (token) request.headers.authorization(this.type, token);
        return request;
    }
    async error(error, client) {
        if (error?.status !== 401) return error;
        const request = error.request;
        if (request?.authorization === false) return error;
        if (!request?.headers?.get?.('Authorization')) return error;
        if (this.unauthorizedNotified) return error;
        this.unauthorizedNotified = true;
        if (this.onUnauthorized) await this.onUnauthorized(error, client);
        return error;
    }
    async currentToken() {
        if (this.hydrated) return this.token;
        if (!this.storage) return this.token;
        const epoch = this.epoch;
        if (!this.hydrating) {
            let pending;
            pending = Promise.resolve().then(()=>this.storage.get()).finally(()=>{
                if (this.hydrating === pending) this.hydrating = null;
            });
            this.hydrating = pending;
        }
        let stored;
        try {
            stored = await this.hydrating;
        } catch (error) {
            if (epoch === this.epoch) this.hydrated = true;
            throw error;
        }
        if (epoch !== this.epoch) return this.token;
        this.hydrated = true;
        if (this.token == null && typeof stored === 'string') {
            const normalized = $cbc2e4173dc2f076$var$normalizeToken(stored);
            if (normalized) this.token = normalized;
        }
        return this.token;
    }
    async commit(token) {
        this.epoch += 1;
        this.token = token;
        this.hydrated = true;
        if (token) this.unauthorizedNotified = false;
        if (!this.storage) return this;
        if (token) await this.storage.set(token);
        else await this.storage.clear();
        return this;
    }
}
function $cbc2e4173dc2f076$var$normalizeToken(token) {
    if (token == null) return null;
    if (typeof token !== 'string') throw new TypeError('token must be a string');
    const value = token.trim();
    return value === '' ? null : value;
}


class $012108e7c81b27fa$export$334c29725a78c21d {
    static defaultPaths = {
        login: 'auth/login',
        logout: 'auth/logout',
        revokeAll: 'auth/revoke-all',
        me: 'auth/me',
        organizations: 'auth/organizations',
        magicLink: 'auth/magic-link',
        consume: 'auth/magic-link/consume'
    };
    constructor(client, options = {}){
        if (!client || typeof client.post !== 'function' || typeof client.get !== 'function') throw new TypeError('Auth requires a Client');
        this.client = client;
        this.authorization = options.authorization ?? client.middlewares?.find((middleware)=>middleware instanceof (0, $cbc2e4173dc2f076$export$6e29424e2d1846ed)) ?? null;
        this.paths = {
            ...$012108e7c81b27fa$export$334c29725a78c21d.defaultPaths,
            ...options.paths
        };
        this.deviceName = options.deviceName ?? 'streams-api-client';
    }
    async login({ email: email, password: password, deviceName: deviceName } = {}) {
        $012108e7c81b27fa$var$requireText(email, 'email');
        $012108e7c81b27fa$var$requireText(password, 'password');
        const response = await this.client.post(this.paths.login, {
            data: {
                email: email,
                password: password,
                device_name: deviceName ?? this.deviceName
            },
            ...$012108e7c81b27fa$var$loggedOut
        });
        $012108e7c81b27fa$var$assertEnvelope(response);
        await this.storeSession(response);
        return response;
    }
    /**
     * Ask the server to send a magic link. This is the claim step.
     */ async requestMagicLink({ email: email } = {}) {
        $012108e7c81b27fa$var$requireText(email, 'email');
        const response = await this.client.post(this.paths.magicLink, {
            data: {
                email: email
            },
            ...$012108e7c81b27fa$var$loggedOut
        });
        $012108e7c81b27fa$var$assertEnvelope(response);
        return response;
    }
    claim(input) {
        return this.requestMagicLink(input);
    }
    /**
     * Exchange the single-use link token for a session. This is the activate step.
     * The argument is the link token, not the session token returned by the server.
     */ async consumeMagicLink({ token: token } = {}) {
        $012108e7c81b27fa$var$requireText(token, 'token');
        const response = await this.client.post(this.paths.consume, {
            data: {
                token: token
            },
            ...$012108e7c81b27fa$var$loggedOut
        });
        $012108e7c81b27fa$var$assertEnvelope(response);
        await this.storeSession(response);
        return response;
    }
    activate(input) {
        return this.consumeMagicLink(input);
    }
    async logout() {
        try {
            return await this.client.post(this.paths.logout, {
                data: {}
            });
        } finally{
            if (this.authorization) await this.authorization.clearToken();
        }
    }
    async revokeAll() {
        try {
            return await this.client.post(this.paths.revokeAll, {
                data: {}
            });
        } finally{
            if (this.authorization) await this.authorization.clearToken();
        }
    }
    /**
     * Current identity. Pass `{ organization: false }` before an organization is selected.
     */ me(config = {}) {
        return this.client.get(this.paths.me, config);
    }
    /**
     * Organizations for the signed-in identity. No tenant header.
     */ organizations() {
        return this.client.get(this.paths.organizations, {
            organization: false
        });
    }
    async storeSession(response) {
        const token = $012108e7c81b27fa$var$readSessionToken(response);
        if (token && this.authorization) await this.authorization.setToken(token);
        return token;
    }
}
const $012108e7c81b27fa$var$loggedOut = {
    organization: false,
    authorization: false
};
function $012108e7c81b27fa$var$requireText(value, name) {
    if (typeof value !== 'string' || value.trim() === '') throw new TypeError(`${name} is required`);
}
function $012108e7c81b27fa$var$assertEnvelope(response) {
    const errors = response?.data?.errors;
    if (!Array.isArray(errors) || errors.length === 0) return response;
    const first = errors[0];
    const message = typeof first === 'string' ? first : first?.message || 'Request failed';
    const error = new Error(message);
    error.response = response;
    throw error;
}
function $012108e7c81b27fa$var$readSessionToken(response) {
    const body = response?.data;
    if (!body || typeof body !== 'object') return null;
    if (typeof body.token === 'string' && body.token.trim() !== '') return body.token.trim();
    if (typeof body.data?.token === 'string' && body.data.token.trim() !== '') return body.data.token.trim();
    return null;
}



/**
 * Base Resource class
 */ class $34d0bca0da7ee085$export$39a853cfb5a94a63 {
    constructor(client){
        this.client = client;
    }
}


class $0c1e8edf525968d2$export$8ee3a38db681f49d extends (0, $34d0bca0da7ee085$export$39a853cfb5a94a63) {
    async get(config = {}) {
        return this.client.request('get', '/streams', config);
    }
    async find(stream, config = {}) {
        return this.client.request('get', `/streams/${stream}`, config);
    }
    async post(data, config = {}) {
        return this.client.request('post', '/streams', config);
    }
    async patch(config = {}) {
        return this.client.request('patch', '/streams', config);
    }
    async put(config = {}) {
        return this.client.request('put', '/streams', config);
    }
    async delete(stream, config = {}) {
        return this.client.request('delete', `/streams/${stream}`, config);
    }
}



class $4bb31526c70c167d$export$be81f2ab9a4121eb extends (0, $34d0bca0da7ee085$export$39a853cfb5a94a63) {
    async get(stream, config = {}) {
        return this.client.request('get', `/streams/${stream}/entries`, config);
    }
    async find(stream, entry, config = {}) {
        return this.client.request('get', `/streams/${stream}/entries/${entry}`, config);
    }
    async post(stream, data, config = {}) {
        config.data = data;
        return this.client.request('post', `/streams/${stream}/entries`, config);
    }
    async patch(stream, entry, data, config = {}) {
        config.data = data;
        return this.client.request('patch', `/streams/${stream}/entries/${entry}`, config);
    }
    async put(stream, entry, data, config = {}) {
        config.data = data;
        return this.client.request('put', `/streams/${stream}/entries/${entry}`, config);
    }
    async delete(stream, entry, config = {}) {
        return this.client.request('delete', `/streams/${stream}/entries/${entry}`, config);
    }
}



class $98e2fd03a3ce98b4$export$b0074bfbbf5cfe5c extends Headers {
    constructor(init){
        super(init && init instanceof $98e2fd03a3ce98b4$export$b0074bfbbf5cfe5c ? init.toObject() : init);
    }
    accept(mime) {
        this.set('Accept', mime);
        return this;
    }
    contentType(mime) {
        this.set('Content-Type', mime);
        return this;
    }
    ifNoneMatch(etag) {
        this.set('If-None-Match', etag);
        return this;
    }
    basic(...args) {
        return this.authorization('Basic', args[1] === undefined ? args[0] : btoa(args[0] + ':' + args[1]));
    }
    bearer(token) {
        return this.authorization('Bearer', token);
    }
    authorization(key, value) {
        this.set('Authorization', key + ' ' + value);
        return this;
    }
    toObject() {
        const result = {};
        this.forEach((value, key)=>{
            result[key] = value;
        });
        return result;
    }
}



class $1db99460b351f96f$export$319b96fe59834522 extends Request {
    constructor(input, init = {}){
        super(input, init);
        const source = input instanceof $1db99460b351f96f$export$319b96fe59834522 ? input : {};
        this.responseType = init.responseType ?? source.responseType ?? 'json';
        const query = init.query ?? source.query ?? {};
        this.query = (0, $4559ecf940edc78d$export$f81ea438226eca0a)(query instanceof Map ? Object.fromEntries(query) : query);
        this.criteria = init.criteria ?? source.criteria;
        this.data = init.data ?? source.data;
        this.response = null;
        // RequestDataMiddleware and QueryMiddleware rebuild the request.
        // Keep per-request auth and organization flags on the new instance.
        this.organization = $1db99460b351f96f$var$carried(init, input, 'organization');
        this.authorization = $1db99460b351f96f$var$carried(init, input, 'authorization');
        // Create custom headers
        Object.defineProperty(this, 'headers', {
            value: new (0, $98e2fd03a3ce98b4$export$b0074bfbbf5cfe5c)(init.headers ?? (input instanceof Request ? input.headers : undefined)),
            writable: false
        });
    }
    isResponseType(responseType) {
        return this.responseType === responseType;
    }
    async fetch(signal = this.signal) {
        // Build fetch options from this request
        const options = {
            method: this.method,
            headers: this.headers,
            mode: this.mode,
            credentials: this.credentials,
            cache: this.cache,
            redirect: this.redirect,
            referrer: this.referrer,
            integrity: this.integrity,
            signal: signal
        };
        // Add body if present
        if (this.body) {
            // Keep the prepared body readable for a subsequent retry.
            options.body = this.clone().body;
            options.duplex = 'half';
        }
        const response = await fetch(this.url, options);
        this.response = response;
        response.request = this;
        return this;
    }
    setUrl(url) {
        Object.defineProperty(this, 'url', {
            value: url,
            writable: false
        });
        return this;
    }
}
function $1db99460b351f96f$var$carried(init, input, key) {
    if (init && Object.prototype.hasOwnProperty.call(init, key)) return init[key];
    if (input instanceof $1db99460b351f96f$export$319b96fe59834522) return input[key];
    return undefined;
}


/**
 * Custom error for HTTP fetch failures
 */ class $c2f1aeaaba3e9a7d$export$26e841bcf1aeb894 extends Error {
    constructor(request){
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
            if (data?.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) this.errors = data.errors;
        } catch  {
        // Non-JSON validation responses remain ordinary HTTP errors.
        }
        return this;
    }
    get response() {
        return this.request.response;
    }
}


const $c896c9eafe70e87c$var$retryableStatuses = new Set([
    408,
    429,
    500,
    502,
    503,
    504
]);
const $c896c9eafe70e87c$var$idempotentMethods = new Set([
    'GET',
    'HEAD',
    'OPTIONS',
    'PUT',
    'DELETE'
]);
const $c896c9eafe70e87c$var$maxTimerDelay = 2147483647;
function $c896c9eafe70e87c$export$5f16de5030553b0b(config) {
    const retries = config.retries ?? 0;
    const retryDelay = config.retryDelay ?? 250;
    const maxRetryDelay = config.maxRetryDelay ?? 30000;
    const timeout = config.timeout ?? 0;
    if (!Number.isInteger(retries) || retries < 0 || retries > 10) throw new RangeError('retries must be an integer between 0 and 10');
    for (const [name, value] of Object.entries({
        retryDelay: retryDelay,
        maxRetryDelay: maxRetryDelay,
        timeout: timeout
    })){
        if (!Number.isFinite(value) || value < 0 || value > $c896c9eafe70e87c$var$maxTimerDelay) throw new RangeError(`${name} must be between 0 and ${$c896c9eafe70e87c$var$maxTimerDelay} milliseconds`);
    }
    if (config.idempotencyKey !== undefined && (typeof config.idempotencyKey !== 'string' || !config.idempotencyKey.trim())) throw new TypeError('idempotencyKey must be a nonempty string');
    return {
        retries: retries,
        retryDelay: retryDelay,
        maxRetryDelay: maxRetryDelay,
        timeout: timeout
    };
}
function $c896c9eafe70e87c$export$6c7cf2cb7d75fad3(request, response) {
    const safe = $c896c9eafe70e87c$var$idempotentMethods.has(request.method) || Boolean(request.headers.get('Idempotency-Key')?.trim());
    return safe && (!response || $c896c9eafe70e87c$var$retryableStatuses.has(response.status));
}
function $c896c9eafe70e87c$export$5a1c93015a826e4(policy, attempt, response) {
    const header = response?.headers.get('Retry-After');
    let delay = policy.retryDelay * 2 ** attempt;
    if (header !== null && header !== undefined) {
        const seconds = /^\d+(\.\d+)?$/.test(header.trim()) ? Number(header) : NaN;
        const requested = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header) - Date.now();
        if (Number.isFinite(requested)) delay = Math.max(delay, requested);
    }
    return Math.min(policy.maxRetryDelay, Math.max(0, delay));
}
function $c896c9eafe70e87c$export$5e51032b9f27710e(signal, timeout) {
    const controller = new AbortController();
    const abort = ()=>controller.abort(signal.reason);
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, {
        once: true
    });
    const timer = timeout > 0 ? setTimeout(()=>{
        controller.abort(new DOMException(`Request timed out after ${timeout}ms`, 'TimeoutError'));
    }, timeout) : undefined;
    return {
        signal: controller.signal,
        dispose () {
            clearTimeout(timer);
            signal?.removeEventListener('abort', abort);
        }
    };
}
async function $c896c9eafe70e87c$export$972370e32542a48f(operation, signal, runWhenAborted = false) {
    if (!runWhenAborted) signal.throwIfAborted();
    let abort;
    try {
        return await Promise.race([
            operation(),
            new Promise((resolve, reject)=>{
                abort = ()=>reject(signal.reason);
                signal.addEventListener('abort', abort, {
                    once: true
                });
                if (signal.aborted) abort();
            })
        ]);
    } finally{
        if (abort) signal.removeEventListener('abort', abort);
    }
}
async function $c896c9eafe70e87c$export$562bc4a862c31607(delay, signal) {
    let timer;
    try {
        await $c896c9eafe70e87c$export$972370e32542a48f(()=>new Promise((resolve)=>{
                timer = setTimeout(resolve, delay);
            }), signal);
    } finally{
        clearTimeout(timer);
    }
}





class $1b87c2c0b7f5abad$export$b79367ae2b118768 extends (0, $39d6e140d9c03804$export$7dc23e3ab61f5f49) {
    static defaultOptions = {
        priority: {
            request: 40
        }
    };
    async request(request, client) {
        if (request.criteria) {
            const criteria = request.criteria;
            request.query.merge(criteria.standardizeParameters());
        }
        return request;
    }
}



class $c272e73d90bc0a59$export$faa9a44a513b92c4 extends (0, $39d6e140d9c03804$export$7dc23e3ab61f5f49) {
    static defaultOptions = {};
    async request(request, client) {
        // ETag support can be added here
        return request;
    }
    async response(response, client) {
        // ETag support can be added here
        return response;
    }
}



class $bd7c22ec2501a222$export$4c5ce066ae8189e1 extends (0, $39d6e140d9c03804$export$7dc23e3ab61f5f49) {
    static headerName = 'X-Organization-ID';
    constructor(options = {}){
        const { priority: priority, organizationId: organizationId, ...rest } = options;
        super(rest);
        this.organizationId = organizationId ?? null;
        // Run after the default request middleware (priority 50), which can
        // rebuild the FetchRequest and would otherwise drop this header.
        this.options = {
            ...this.options,
            priority: {
                request: priority?.request ?? 60,
                response: priority?.response ?? this.options?.priority?.response ?? 50,
                error: priority?.error ?? this.options?.priority?.error ?? 50
            }
        };
    }
    /**
     * Replace the organization id. Null or '' clears it.
     */ setOrganization(organizationId) {
        this.organizationId = organizationId ?? null;
        return this;
    }
    async request(request, client) {
        const headerName = this.constructor.headerName;
        if ($bd7c22ec2501a222$var$isOptOut(request?.organization)) {
            request.headers.delete(headerName);
            return request;
        }
        const organizationId = this.resolveOrganizationId(request, client);
        if (organizationId === null) return request;
        request.headers.set(headerName, organizationId);
        return request;
    }
    resolveOrganizationId(request, client) {
        const override = $bd7c22ec2501a222$var$organizationIdValue(request?.organization);
        if (override !== null) return override;
        const configured = $bd7c22ec2501a222$var$organizationIdValue(this.organizationId);
        if (configured !== null) return configured;
        return $bd7c22ec2501a222$var$organizationIdValue(client?.options?.organizationId);
    }
}
function $bd7c22ec2501a222$var$isOptOut(value) {
    return value === false || value === null || value === '';
}
function $bd7c22ec2501a222$var$organizationIdValue(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (typeof value === 'string' && value !== '') return value;
    return null;
}





class $cb618720e3539df9$export$a74cfeef44e69e22 extends (0, $39d6e140d9c03804$export$7dc23e3ab61f5f49) {
    static defaultOptions = {
        stringify: {
            encodeValuesOnly: true
        }
    };
    async request(request, client) {
        if (!request.query.empty()) {
            const queryString = (0, $4559ecf940edc78d$export$fac44ee5b035f737)(request.query.toObject(), this.options.stringify);
            const url = request.url + '?' + queryString;
            request = new (0, $1db99460b351f96f$export$319b96fe59834522)(url, request);
        }
        return request;
    }
}




class $db0116cc62677c9f$export$81bc91ba859dba8e extends (0, $39d6e140d9c03804$export$7dc23e3ab61f5f49) {
    static defaultOptions = {};
    async request(request, client) {
        if (request.data) request = new (0, $1db99460b351f96f$export$319b96fe59834522)(request, {
            body: JSON.stringify(request.data)
        });
        return request;
    }
}



class $30421c5a2897c231$export$60dea4b97ea2ef30 extends (0, $39d6e140d9c03804$export$7dc23e3ab61f5f49) {
    static defaultOptions = {};
    async response(response, client) {
        const request = response.request;
        if (request.isResponseType('arraybuffer')) response.data = await response.arrayBuffer();
        else if (request.isResponseType('blob')) response.data = await response.blob();
        else if (request.isResponseType('document')) response.data = await response.formData();
        else if (request.isResponseType('json')) response.data = await response.json();
        else if (request.isResponseType('stream')) response.data = await response.body;
        else if (request.isResponseType('text')) response.data = await response.text();
        return response;
    }
}




class $8921af6a8136d8e3$export$1f2bb630327ac4b6 {
    constructor(options){
        options = {
            middlewares: [],
            defaultMiddlewares: [
                new (0, $db0116cc62677c9f$export$81bc91ba859dba8e)(),
                new (0, $1b87c2c0b7f5abad$export$b79367ae2b118768)(),
                new (0, $cb618720e3539df9$export$a74cfeef44e69e22)(),
                new (0, $30421c5a2897c231$export$60dea4b97ea2ef30)()
            ],
            ...options
        };
        this.options = {
            baseURL: '',
            request: {
                mode: 'cors',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        };
        const { middlewares: middlewares, defaultMiddlewares: defaultMiddlewares, ...opts } = options;
        this.options = (0, $4559ecf940edc78d$export$2321aea138b44780)({}, this.options, opts);
        this.middlewares = defaultMiddlewares.concat(middlewares);
        this.streams = new (0, $0c1e8edf525968d2$export$8ee3a38db681f49d)(this);
        this.entries = new (0, $4bb31526c70c167d$export$be81f2ab9a4121eb)(this);
    }
    /**
     * Add a middleware to the client
     */ use(middleware) {
        this.middlewares.push(middleware);
    }
    /**
     * Make an HTTP request
     */ async request(method, uri, config = {}) {
        const url = (0, $4559ecf940edc78d$export$ed61451db706e904).ensureRight(this.options.baseURL, '/') + (0, $4559ecf940edc78d$export$ed61451db706e904).stripLeft(uri, '/');
        const headers = new Headers(this.options.request.headers);
        new Headers(config.headers).forEach((value, key)=>headers.set(key, value));
        config = (0, $4559ecf940edc78d$export$2321aea138b44780)({}, this.options.request, config, {
            method: method,
            headers: headers
        });
        const policy = (0, $c896c9eafe70e87c$export$5f16de5030553b0b)(config);
        const scope = (0, $c896c9eafe70e87c$export$5e51032b9f27710e)(config.signal, policy.timeout);
        try {
            let request = new (0, $1db99460b351f96f$export$319b96fe59834522)(url, {
                ...config,
                signal: scope.signal
            });
            request = await (0, $c896c9eafe70e87c$export$972370e32542a48f)(()=>(0, $39d6e140d9c03804$export$7dc23e3ab61f5f49).run(this, request, 'request'), scope.signal);
            if (config.idempotencyKey !== undefined) request.headers.set('Idempotency-Key', config.idempotencyKey);
            for(let attempt = 0;; attempt++){
                let networkError;
                try {
                    await (0, $c896c9eafe70e87c$export$972370e32542a48f)(()=>request.fetch(scope.signal), scope.signal);
                } catch (error) {
                    scope.signal.throwIfAborted();
                    if (!(error instanceof TypeError)) throw error;
                    networkError = error;
                }
                const response = networkError ? null : request.response;
                if (attempt < policy.retries && (0, $c896c9eafe70e87c$export$6c7cf2cb7d75fad3)(request, response) && (networkError || !response.ok)) {
                    const delay = (0, $c896c9eafe70e87c$export$5a1c93015a826e4)(policy, attempt, response);
                    if (response?.body) await (0, $c896c9eafe70e87c$export$972370e32542a48f)(()=>response.body.cancel(), scope.signal);
                    await (0, $c896c9eafe70e87c$export$562bc4a862c31607)(delay, scope.signal);
                    continue;
                }
                if (networkError) throw networkError;
                if (!response.ok) {
                    const error = new (0, $c2f1aeaaba3e9a7d$export$26e841bcf1aeb894)(request);
                    await (0, $c896c9eafe70e87c$export$972370e32542a48f)(()=>error.mapValidationErrors(), scope.signal);
                    throw error;
                }
                request.response = await (0, $c896c9eafe70e87c$export$972370e32542a48f)(()=>(0, $39d6e140d9c03804$export$7dc23e3ab61f5f49).run(this, response, 'response'), scope.signal);
                return request.response;
            }
        } catch (error) {
            // Notify error middleware even on abort, but never let it hold up cancellation.
            error = await (0, $c896c9eafe70e87c$export$972370e32542a48f)(()=>(0, $39d6e140d9c03804$export$7dc23e3ab61f5f49).run(this, error, 'error'), scope.signal, true);
            throw error;
        } finally{
            scope.dispose();
        }
    }
    /**
     * Make a GET request
     */ async get(uri, config = {}) {
        return this.request('GET', uri, config);
    }
    /**
     * Make a POST request
     */ async post(uri, config = {}) {
        return this.request('POST', uri, config);
    }
    /**
     * Make a PATCH request
     */ async patch(uri, config = {}) {
        return this.request('PATCH', uri, config);
    }
    /**
     * Make a PUT request
     */ async put(uri, config = {}) {
        return this.request('PUT', uri, config);
    }
    /**
     * Make a DELETE request
     */ async delete(uri, config = {}) {
        return this.request('DELETE', uri, config);
    }
}



const $67738b032127bbc4$export$80f624d7e49719a5 = [
    '>',
    '<',
    '==',
    '!=',
    '>=',
    '<=',
    '!<',
    '!>',
    '<>'
];
const $67738b032127bbc4$export$7f6dbd4511c7e3c2 = [
    'BETWEEN',
    'EXISTS',
    'OR',
    'AND',
    'NOT',
    'IN',
    'ALL',
    'ANY',
    'LIKE',
    'IS NULL',
    'UNIQUE'
];
const $67738b032127bbc4$export$ccbce4efa7f8029b = [].concat($67738b032127bbc4$export$80f624d7e49719a5).concat($67738b032127bbc4$export$7f6dbd4511c7e3c2);
/**
 * Check if value is a valid operator
 */ const $67738b032127bbc4$var$isOperator = (value)=>$67738b032127bbc4$export$ccbce4efa7f8029b.includes(value);
class $67738b032127bbc4$export$9bcb229a699e7da1 {
    constructor(){
        this.parameters = [];
    }
    static make() {
        return new this();
    }
    /**
     * Find an entry by ID
     */ find(id) {
        return this.where('id', id).first();
    }
    /**
     * Return the first result
     */ first() {
        return this.limit(1);
    }
    /**
     * Order the query by field/direction
     */ orderBy(key, direction = 'desc') {
        this.addParameter('orderBy', [
            key,
            direction
        ]);
        return this;
    }
    /**
     * Limit the entries returned
     */ limit(value) {
        this.addParameter('limit', value);
        return this;
    }
    /**
     * Constrain the query by field, operator, value
     * Supports multiple signatures:
     * - where(key, value)
     * - where(key, operator, value)
     * - where(key, operator, value, nested)
     */ where(...args) {
        let key, operator, value, nested = null;
        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        } else if (args.length === 3) {
            key = args[0];
            operator = args[1];
            value = args[2];
        } else if (args.length === 4) {
            key = args[0];
            operator = args[1];
            value = args[2];
            nested = args[3];
        }
        if (!$67738b032127bbc4$var$isOperator(operator)) throw new Error(`Criteria where() operator "${operator}" not valid`);
        this.addParameter('where', [
            key,
            operator,
            value,
            nested
        ]);
        return this;
    }
    /**
     * Add an OR WHERE clause
     */ orWhere(...args) {
        let key, operator, value;
        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        } else {
            key = args[0];
            operator = args[1];
            value = args[2];
        }
        if (!$67738b032127bbc4$var$isOperator(operator)) throw new Error(`Criteria orWhere() operator "${operator}" not valid`);
        this.addParameter('where', [
            key,
            operator,
            value,
            'or'
        ]);
        return this;
    }
    /**
     * Get paginated criteria results
     */ paginate(per_page = 100, page = 1) {
        this.addParameter('paginate', true);
        this.addParameter('per_page', per_page);
        this.addParameter('page', page);
        return this;
    }
    /**
     * Get the parameters
     */ getParameters() {
        return this.parameters;
    }
    /**
     * Set the parameters
     */ setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
    /**
     * Add a parameter
     */ addParameter(name, value) {
        this.parameters.push({
            name: name,
            value: value
        });
        return this;
    }
    /**
     * Return standardized parameters
     */ standardizeParameters() {
        return this.parameters.map((kv)=>[
                kv['name'],
                kv['value']
            ]).reduce((obj, [k, v], i, data)=>{
            if (Array.isArray(v)) data.slice().filter((kv)=>kv['name'] === k);
            return {
                ...obj,
                [k]: v
            };
        }, {});
    }
    /**
     * Compile criteria to query string
     */ compile() {
        return (0, $4559ecf940edc78d$export$f09552f0f3c8e6f7)(this.standardizeParameters());
    }
}








/**
 * Pluggable session-token storage.
 *
 * Adapters implement get(), set(token), and clear(). Use memory in Node and
 * tests, Web Storage in a browser, or secureStorageAdapter for a Capacitor
 * plugin with get/set/remove. The adapter stores whatever string the app
 * gives it. This module never writes a token of its own.
 */ class $2354d111a4ca800f$export$3eea21c5b25eb11d {
    constructor(token = null){
        this.token = $2354d111a4ca800f$var$normalizeStoredToken(token);
    }
    async get() {
        return this.token;
    }
    async set(token) {
        this.token = $2354d111a4ca800f$var$normalizeStoredToken(token);
    }
    async clear() {
        this.token = null;
    }
}
class $2354d111a4ca800f$export$621255c1835a0665 {
    constructor(storage, key = 'streams.auth.token'){
        if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function' || typeof storage.removeItem !== 'function') throw new TypeError('WebStorageTokenStorage requires getItem, setItem, and removeItem');
        if (typeof key !== 'string' || key.trim() === '') throw new TypeError('WebStorageTokenStorage requires a storage key');
        this.storage = storage;
        this.key = key;
    }
    async get() {
        return this.storage.getItem(this.key);
    }
    async set(token) {
        const value = $2354d111a4ca800f$var$normalizeStoredToken(token);
        if (value == null) {
            this.storage.removeItem(this.key);
            return;
        }
        this.storage.setItem(this.key, value);
    }
    async clear() {
        this.storage.removeItem(this.key);
    }
}
function $2354d111a4ca800f$export$ec8b0aa9e541d550(plugin, key = 'streams.auth.token') {
    if (!plugin || typeof plugin.get !== 'function' || typeof plugin.set !== 'function' || typeof plugin.remove !== 'function') throw new TypeError('secureStorageAdapter requires get, set, and remove');
    if (typeof key !== 'string' || key.trim() === '') throw new TypeError('secureStorageAdapter requires a storage key');
    return {
        async get () {
            try {
                const result = await plugin.get({
                    key: key
                });
                if (result == null) return null;
                if (typeof result === 'string') return result === '' ? null : result;
                if (typeof result.value !== 'string' || result.value === '') return null;
                return result.value;
            } catch (error) {
                if ($2354d111a4ca800f$var$isMissingKey(error)) return null;
                throw error;
            }
        },
        async set (token) {
            const value = $2354d111a4ca800f$var$normalizeStoredToken(token);
            if (value == null) {
                await this.clear();
                return;
            }
            await plugin.set({
                key: key,
                value: value
            });
        },
        async clear () {
            try {
                await plugin.remove({
                    key: key
                });
            } catch (error) {
                if ($2354d111a4ca800f$var$isMissingKey(error)) return;
                throw error;
            }
        }
    };
}
function $2354d111a4ca800f$export$b40ecb0ca14d8c82(source, options = {}) {
    if (source == null) return new $2354d111a4ca800f$export$3eea21c5b25eb11d(options.token ?? null);
    if (typeof source.get === 'function' && typeof source.set === 'function' && typeof source.clear === 'function') return source;
    if (typeof source.getItem === 'function' && typeof source.setItem === 'function' && typeof source.removeItem === 'function') return new $2354d111a4ca800f$export$621255c1835a0665(source, options.key);
    if (typeof source.get === 'function' && typeof source.set === 'function' && typeof source.remove === 'function') return $2354d111a4ca800f$export$ec8b0aa9e541d550(source, options.key);
    throw new TypeError('Token storage must implement get/set/clear, Web Storage, or get/set/remove');
}
function $2354d111a4ca800f$var$normalizeStoredToken(token) {
    if (token == null) return null;
    if (typeof token !== 'string') throw new TypeError('token must be a string');
    const value = token.trim();
    return value === '' ? null : value;
}
function $2354d111a4ca800f$var$isMissingKey(error) {
    const message = String(error?.message || error || '');
    return /not found|does not exist|item not found|no value/i.test(message);
}



// Make available globally if in browser
if (typeof window !== 'undefined') window.streams_api = {
    Auth: $012108e7c81b27fa$export$334c29725a78c21d,
    Client: $8921af6a8136d8e3$export$1f2bb630327ac4b6,
    Criteria: $67738b032127bbc4$export$9bcb229a699e7da1,
    Entries: $4bb31526c70c167d$export$be81f2ab9a4121eb,
    FetchError: $c2f1aeaaba3e9a7d$export$26e841bcf1aeb894,
    FetchHeaders: $98e2fd03a3ce98b4$export$b0074bfbbf5cfe5c,
    FetchRequest: $1db99460b351f96f$export$319b96fe59834522,
    Resource: $34d0bca0da7ee085$export$39a853cfb5a94a63,
    Streams: $0c1e8edf525968d2$export$8ee3a38db681f49d,
    MemoryTokenStorage: $2354d111a4ca800f$export$3eea21c5b25eb11d,
    WebStorageTokenStorage: $2354d111a4ca800f$export$621255c1835a0665,
    createTokenStorage: $2354d111a4ca800f$export$b40ecb0ca14d8c82,
    secureStorageAdapter: $2354d111a4ca800f$export$ec8b0aa9e541d550,
    AuthorizationMiddleware: $cbc2e4173dc2f076$export$6e29424e2d1846ed,
    CriteriaMiddleware: $1b87c2c0b7f5abad$export$b79367ae2b118768,
    ETagMiddleware: $c272e73d90bc0a59$export$faa9a44a513b92c4,
    OrganizationMiddleware: $bd7c22ec2501a222$export$4c5ce066ae8189e1,
    Middleware: $39d6e140d9c03804$export$7dc23e3ab61f5f49,
    QueryMiddleware: $cb618720e3539df9$export$a74cfeef44e69e22,
    RequestDataMiddleware: $db0116cc62677c9f$export$81bc91ba859dba8e,
    ResponseDataMiddleware: $30421c5a2897c231$export$60dea4b97ea2ef30
};


//# sourceMappingURL=index.js.map
