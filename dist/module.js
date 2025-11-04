/**
 * String utility class
 */ class $f3ad94c9f84f4d57$export$ed61451db706e904 {
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
const $f3ad94c9f84f4d57$export$92b78acdbe066b6b = (obj, [k, v])=>({
        ...obj,
        [k]: v
    });
function $f3ad94c9f84f4d57$export$f09552f0f3c8e6f7(params) {
    return encodeURIComponent(btoa(JSON.stringify(params)));
}
const $f3ad94c9f84f4d57$export$2321aea138b44780 = (target, ...sources)=>{
    if (!sources.length) return target;
    const source = sources.shift();
    if (source === undefined) return target;
    if ($f3ad94c9f84f4d57$var$isMergeableObject(target) && $f3ad94c9f84f4d57$var$isMergeableObject(source)) Object.keys(source).forEach(function(key) {
        if ($f3ad94c9f84f4d57$var$isMergeableObject(source[key])) {
            if (!target[key]) target[key] = {};
            $f3ad94c9f84f4d57$export$2321aea138b44780(target[key], source[key]);
        } else target[key] = source[key];
    });
    return $f3ad94c9f84f4d57$export$2321aea138b44780(target, ...sources);
};
const $f3ad94c9f84f4d57$export$a6cdc56e425d0d0a = (item)=>{
    return item !== null && typeof item === 'object';
};
/**
 * Check if object is mergeable
 */ const $f3ad94c9f84f4d57$var$isMergeableObject = (item)=>{
    return $f3ad94c9f84f4d57$export$a6cdc56e425d0d0a(item) && !Array.isArray(item);
};
function $f3ad94c9f84f4d57$export$f81ea438226eca0a(obj = {}) {
    const map = new class extends Map {
        toObject() {
            return Array.from(this.entries()).map((kv)=>[
                    kv[0],
                    kv[1]
                ]).reduce($f3ad94c9f84f4d57$export$92b78acdbe066b6b, {});
        }
        toKeys() {
            return Array.from(this.keys());
        }
        merge(obj) {
            obj = $f3ad94c9f84f4d57$export$2321aea138b44780(this.toObject(), obj);
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
function $f3ad94c9f84f4d57$export$fac44ee5b035f737(obj, options = {}) {
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


/**
 * Base Resource class
 */ class $3d19956470823652$export$39a853cfb5a94a63 {
    constructor(client){
        this.client = client;
    }
}


class $4e671f1a527ffd7a$export$8ee3a38db681f49d extends (0, $3d19956470823652$export$39a853cfb5a94a63) {
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



class $dfa8fc46f40c0bbf$export$be81f2ab9a4121eb extends (0, $3d19956470823652$export$39a853cfb5a94a63) {
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



class $c0e96e2b2fbcb8a5$export$b0074bfbbf5cfe5c extends Headers {
    constructor(init){
        super(init && init instanceof $c0e96e2b2fbcb8a5$export$b0074bfbbf5cfe5c ? init.toObject() : init);
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



class $4eff35de4434c113$export$319b96fe59834522 extends Request {
    constructor(input, init = {}){
        super(input, init);
        this.responseType = init.responseType || 'json';
        this.query = (0, $f3ad94c9f84f4d57$export$f81ea438226eca0a)(init.query || {});
        this.criteria = init.criteria;
        this.data = init.data;
        this.response = null;
        // Create custom headers
        Object.defineProperty(this, 'headers', {
            value: new (0, $c0e96e2b2fbcb8a5$export$b0074bfbbf5cfe5c)(init.headers),
            writable: false
        });
    }
    isResponseType(responseType) {
        return this.responseType === responseType;
    }
    async fetch() {
        // Build fetch options from this request
        const options = {
            method: this.method,
            headers: this.headers,
            mode: this.mode,
            credentials: this.credentials,
            cache: this.cache,
            redirect: this.redirect,
            referrer: this.referrer,
            integrity: this.integrity
        };
        // Add body if present
        if (this.body) options.body = this.body;
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


/**
 * Custom error for HTTP fetch failures
 */ class $827b4d16e4856d30$export$26e841bcf1aeb894 extends Error {
    constructor(request){
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



class $b66054862766a59c$export$7dc23e3ab61f5f49 {
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
        const middlewares = $b66054862766a59c$export$7dc23e3ab61f5f49.get(client.middlewares, kind);
        for (const middleware of middlewares)target = await middleware[kind](target, client);
        return target;
    }
    /**
     * Get default options with inheritance
     */ static getDefaultOptions(t, options = {}) {
        if ((0, $f3ad94c9f84f4d57$export$a6cdc56e425d0d0a)(t.defaultOptions)) options = (0, $f3ad94c9f84f4d57$export$2321aea138b44780)(t.defaultOptions, options);
        let parent = Object.getPrototypeOf(t);
        if (parent && (0, $f3ad94c9f84f4d57$export$a6cdc56e425d0d0a)(parent.defaultOptions)) options = this.getDefaultOptions(parent, options);
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



class $24f116b90a41a6fb$export$6e29424e2d1846ed extends (0, $b66054862766a59c$export$7dc23e3ab61f5f49) {
    constructor(options = {}){
        super(options);
        this.token = options.token || null;
        this.type = options.type || 'Bearer';
    }
    async request(request, client) {
        if (this.token) {
            console.log('AuthorizationMiddleware: Setting token', this.type, this.token);
            request.headers.authorization(this.type, this.token);
            console.log('AuthorizationMiddleware: Header set, checking...', request.headers.get('Authorization'));
        }
        return request;
    }
    setToken(token, type = 'Bearer') {
        this.token = token;
        this.type = type;
        return this;
    }
}



class $d3134a7939a75d13$export$b79367ae2b118768 extends (0, $b66054862766a59c$export$7dc23e3ab61f5f49) {
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



class $86b82e06a87407d7$export$faa9a44a513b92c4 extends (0, $b66054862766a59c$export$7dc23e3ab61f5f49) {
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





class $d889f0a51d8c2aa1$export$a74cfeef44e69e22 extends (0, $b66054862766a59c$export$7dc23e3ab61f5f49) {
    static defaultOptions = {
        stringify: {
            encodeValuesOnly: true
        }
    };
    async request(request, client) {
        if (!request.query.empty()) {
            const queryString = (0, $f3ad94c9f84f4d57$export$fac44ee5b035f737)(request.query.toObject(), this.options.stringify);
            const url = request.url + '?' + queryString;
            request = new (0, $4eff35de4434c113$export$319b96fe59834522)(url, request);
        }
        return request;
    }
}




class $b41a23ef233577d1$export$81bc91ba859dba8e extends (0, $b66054862766a59c$export$7dc23e3ab61f5f49) {
    static defaultOptions = {};
    async request(request, client) {
        if (request.data) request = new (0, $4eff35de4434c113$export$319b96fe59834522)(request, {
            body: JSON.stringify(request.data)
        });
        return request;
    }
}



class $a0b7011eda0626b0$export$60dea4b97ea2ef30 extends (0, $b66054862766a59c$export$7dc23e3ab61f5f49) {
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




class $b7042f052a98e3f2$export$1f2bb630327ac4b6 {
    constructor(options){
        options = {
            middlewares: [],
            defaultMiddlewares: [
                new (0, $b41a23ef233577d1$export$81bc91ba859dba8e)(),
                new (0, $d3134a7939a75d13$export$b79367ae2b118768)(),
                new (0, $d889f0a51d8c2aa1$export$a74cfeef44e69e22)(),
                new (0, $a0b7011eda0626b0$export$60dea4b97ea2ef30)()
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
        this.options = (0, $f3ad94c9f84f4d57$export$2321aea138b44780)(this.options, opts);
        this.middlewares = defaultMiddlewares.concat(middlewares);
        this.streams = new (0, $4e671f1a527ffd7a$export$8ee3a38db681f49d)(this);
        this.entries = new (0, $dfa8fc46f40c0bbf$export$be81f2ab9a4121eb)(this);
    }
    /**
     * Add a middleware to the client
     */ use(middleware) {
        this.middlewares.push(middleware);
    }
    /**
     * Make an HTTP request
     */ async request(method, uri, config = {}) {
        let url = (0, $f3ad94c9f84f4d57$export$ed61451db706e904).ensureRight(this.options.baseURL, '/') + (0, $f3ad94c9f84f4d57$export$ed61451db706e904).stripLeft(uri, '/');
        config.method = method;
        config = (0, $f3ad94c9f84f4d57$export$2321aea138b44780)(this.options.request, config);
        let request = new (0, $4eff35de4434c113$export$319b96fe59834522)(url, config);
        request = await (0, $b66054862766a59c$export$7dc23e3ab61f5f49).run(this, request, 'request');
        return request.fetch().then(async (request)=>{
            if (!request.response.ok) throw new (0, $827b4d16e4856d30$export$26e841bcf1aeb894)(request);
            request.response = await (0, $b66054862766a59c$export$7dc23e3ab61f5f49).run(this, request.response, 'response');
            return request.response;
        }).catch(async (error)=>{
            error = await (0, $b66054862766a59c$export$7dc23e3ab61f5f49).run(this, error, 'error');
            throw error;
        });
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



const $1aded8984edd6d2b$export$80f624d7e49719a5 = [
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
const $1aded8984edd6d2b$export$7f6dbd4511c7e3c2 = [
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
const $1aded8984edd6d2b$export$ccbce4efa7f8029b = [].concat($1aded8984edd6d2b$export$80f624d7e49719a5).concat($1aded8984edd6d2b$export$7f6dbd4511c7e3c2);
/**
 * Check if value is a valid operator
 */ const $1aded8984edd6d2b$var$isOperator = (value)=>$1aded8984edd6d2b$export$ccbce4efa7f8029b.includes(value);
class $1aded8984edd6d2b$export$9bcb229a699e7da1 {
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
        if (!$1aded8984edd6d2b$var$isOperator(operator)) throw new Error(`Criteria where() operator "${operator}" not valid`);
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
        if (!$1aded8984edd6d2b$var$isOperator(operator)) throw new Error(`Criteria orWhere() operator "${operator}" not valid`);
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
        return (0, $f3ad94c9f84f4d57$export$f09552f0f3c8e6f7)(this.standardizeParameters());
    }
}









// Make available globally if in browser
if (typeof window !== 'undefined') window.streams_api = {
    Client: $b7042f052a98e3f2$export$1f2bb630327ac4b6,
    Criteria: $1aded8984edd6d2b$export$9bcb229a699e7da1,
    Entries: $dfa8fc46f40c0bbf$export$be81f2ab9a4121eb,
    FetchError: $827b4d16e4856d30$export$26e841bcf1aeb894,
    FetchHeaders: $c0e96e2b2fbcb8a5$export$b0074bfbbf5cfe5c,
    FetchRequest: $4eff35de4434c113$export$319b96fe59834522,
    Resource: $3d19956470823652$export$39a853cfb5a94a63,
    Streams: $4e671f1a527ffd7a$export$8ee3a38db681f49d,
    AuthorizationMiddleware: $24f116b90a41a6fb$export$6e29424e2d1846ed,
    CriteriaMiddleware: $d3134a7939a75d13$export$b79367ae2b118768,
    ETagMiddleware: $86b82e06a87407d7$export$faa9a44a513b92c4,
    Middleware: $b66054862766a59c$export$7dc23e3ab61f5f49,
    QueryMiddleware: $d889f0a51d8c2aa1$export$a74cfeef44e69e22,
    RequestDataMiddleware: $b41a23ef233577d1$export$81bc91ba859dba8e,
    ResponseDataMiddleware: $a0b7011eda0626b0$export$60dea4b97ea2ef30
};


export {$b7042f052a98e3f2$export$1f2bb630327ac4b6 as Client, $1aded8984edd6d2b$export$9bcb229a699e7da1 as Criteria, $dfa8fc46f40c0bbf$export$be81f2ab9a4121eb as Entries, $827b4d16e4856d30$export$26e841bcf1aeb894 as FetchError, $c0e96e2b2fbcb8a5$export$b0074bfbbf5cfe5c as FetchHeaders, $4eff35de4434c113$export$319b96fe59834522 as FetchRequest, $3d19956470823652$export$39a853cfb5a94a63 as Resource, $4e671f1a527ffd7a$export$8ee3a38db681f49d as Streams, $24f116b90a41a6fb$export$6e29424e2d1846ed as AuthorizationMiddleware, $d3134a7939a75d13$export$b79367ae2b118768 as CriteriaMiddleware, $86b82e06a87407d7$export$faa9a44a513b92c4 as ETagMiddleware, $b66054862766a59c$export$7dc23e3ab61f5f49 as Middleware, $d889f0a51d8c2aa1$export$a74cfeef44e69e22 as QueryMiddleware, $b41a23ef233577d1$export$81bc91ba859dba8e as RequestDataMiddleware, $a0b7011eda0626b0$export$60dea4b97ea2ef30 as ResponseDataMiddleware};
//# sourceMappingURL=module.js.map
