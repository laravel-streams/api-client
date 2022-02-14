var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Response_headers;
export class Response {
    constructor() {
        _Response_headers.set(this, {});
    }
    set headers(headers) {
        __classPrivateFieldSet(this, _Response_headers, {}, "f");
        Object.entries(headers).forEach(([key, value]) => {
            __classPrivateFieldGet(this, _Response_headers, "f")[key] = value;
            __classPrivateFieldGet(this, _Response_headers, "f")[key.toLowerCase()] = value;
        });
    }
    get headers() { return __classPrivateFieldGet(this, _Response_headers, "f"); }
    get ok() { return this.status >= 200 && this.status <= 299; }
    get redirected() { return this.status === Response.HTTP_TEMPORARY_REDIRECT || this.status === Response.HTTP_PERMANENTLY_REDIRECT; }
    hasHeader(name) { return __classPrivateFieldGet(this, _Response_headers, "f")[name.toLocaleLowerCase()] !== undefined; }
    getHeader(name) { return __classPrivateFieldGet(this, _Response_headers, "f")[name.toLocaleLowerCase()]; }
    static fromAxiosResponse(axiosResponse) {
        const response = new Response();
        Object.assign(response, axiosResponse);
        return response;
    }
}
_Response_headers = new WeakMap();
(function (Response) {
    Response.HTTP_CONTINUE = 100;
    Response.HTTP_SWITCHING_PROTOCOLS = 101;
    Response.HTTP_PROCESSING = 102; // RFC2518
    Response.HTTP_EARLY_HINTS = 103; // RFC8297
    Response.HTTP_OK = 200;
    Response.HTTP_CREATED = 201;
    Response.HTTP_ACCEPTED = 202;
    Response.HTTP_NON_AUTHORITATIVE_INFORMATION = 203;
    Response.HTTP_NO_CONTENT = 204;
    Response.HTTP_RESET_CONTENT = 205;
    Response.HTTP_PARTIAL_CONTENT = 206;
    Response.HTTP_MULTI_STATUS = 207; // RFC4918
    Response.HTTP_ALREADY_REPORTED = 208; // RFC5842
    Response.HTTP_IM_USED = 226; // RFC3229
    Response.HTTP_MULTIPLE_CHOICES = 300;
    Response.HTTP_MOVED_PERMANENTLY = 301;
    Response.HTTP_FOUND = 302;
    Response.HTTP_SEE_OTHER = 303;
    Response.HTTP_NOT_MODIFIED = 304;
    Response.HTTP_USE_PROXY = 305;
    Response.HTTP_RESERVED = 306;
    Response.HTTP_TEMPORARY_REDIRECT = 307;
    Response.HTTP_PERMANENTLY_REDIRECT = 308; // RFC7238
    Response.HTTP_BAD_REQUEST = 400;
    Response.HTTP_UNAUTHORIZED = 401;
    Response.HTTP_PAYMENT_REQUIRED = 402;
    Response.HTTP_FORBIDDEN = 403;
    Response.HTTP_NOT_FOUND = 404;
    Response.HTTP_METHOD_NOT_ALLOWED = 405;
    Response.HTTP_NOT_ACCEPTABLE = 406;
    Response.HTTP_PROXY_AUTHENTICATION_REQUIRED = 407;
    Response.HTTP_REQUEST_TIMEOUT = 408;
    Response.HTTP_CONFLICT = 409;
    Response.HTTP_GONE = 410;
    Response.HTTP_LENGTH_REQUIRED = 411;
    Response.HTTP_PRECONDITION_FAILED = 412;
    Response.HTTP_REQUEST_ENTITY_TOO_LARGE = 413;
    Response.HTTP_REQUEST_URI_TOO_LONG = 414;
    Response.HTTP_UNSUPPORTED_MEDIA_TYPE = 415;
    Response.HTTP_REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    Response.HTTP_EXPECTATION_FAILED = 417;
    Response.HTTP_I_AM_A_TEAPOT = 418; // RFC2324
    Response.HTTP_MISDIRECTED_REQUEST = 421; // RFC7540
    Response.HTTP_UNPROCESSABLE_ENTITY = 422; // RFC4918
    Response.HTTP_LOCKED = 423; // RFC4918
    Response.HTTP_FAILED_DEPENDENCY = 424; // RFC4918
    Response.HTTP_TOO_EARLY = 425; // RFC-ietf-httpbis-replay-04
    Response.HTTP_UPGRADE_REQUIRED = 426; // RFC2817
    Response.HTTP_PRECONDITION_REQUIRED = 428; // RFC6585
    Response.HTTP_TOO_MANY_REQUESTS = 429; // RFC6585
    Response.HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE = 431; // RFC6585
    Response.HTTP_UNAVAILABLE_FOR_LEGAL_REASONS = 451;
    Response.HTTP_INTERNAL_SERVER_ERROR = 500;
    Response.HTTP_NOT_IMPLEMENTED = 501;
    Response.HTTP_BAD_GATEWAY = 502;
    Response.HTTP_SERVICE_UNAVAILABLE = 503;
    Response.HTTP_GATEWAY_TIMEOUT = 504;
    Response.HTTP_VERSION_NOT_SUPPORTED = 505;
    Response.HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL = 506; // RFC2295
    Response.HTTP_INSUFFICIENT_STORAGE = 507; // RFC4918
    Response.HTTP_LOOP_DETECTED = 508; // RFC5842
    Response.HTTP_NOT_EXTENDED = 510; // RFC2774
    Response.HTTP_NETWORK_AUTHENTICATION_REQUIRED = 511; // RFC6585
    Response.statusTexts = {
        '100': 'Continue',
        '101': 'Switching Protocols',
        '102': 'Processing',
        '103': 'Early Hints',
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '207': 'Multi-Status',
        '208': 'Already Reported',
        '226': 'IM Used',
        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Found',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '307': 'Temporary Redirect',
        '308': 'Permanent Redirect',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Timeout',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Failed',
        '413': 'Content Too Large',
        '414': 'URI Too Long',
        '415': 'Unsupported Media Type',
        '416': 'Range Not Satisfiable',
        '417': 'Expectation Failed',
        '418': 'I\'m a teapot',
        '421': 'Misdirected Request',
        '422': 'Unprocessable Content',
        '423': 'Locked',
        '424': 'Failed Dependency',
        '425': 'Too Early',
        '426': 'Upgrade Required',
        '428': 'Precondition Required',
        '429': 'Too Many Requests',
        '431': 'Request Header Fields Too Large',
        '451': 'Unavailable For Legal Reasons',
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Timeout',
        '505': 'HTTP Version Not Supported',
        '506': 'Variant Also Negotiates',
        '507': 'Insufficient Storage',
        '508': 'Loop Detected',
        '510': 'Not Extended',
        '511': 'Network Authentication Required', // RFC6585
    };
})(Response || (Response = {}));
