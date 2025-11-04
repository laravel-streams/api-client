export { Client } from './Client.js';
export { Criteria } from './Criteria.js';
export { Entries } from './Entries.js';
export { FetchError } from './FetchError.js';
export { FetchHeaders } from './FetchHeaders.js';
export { FetchRequest } from './FetchRequest.js';
export { Resource } from './Resource.js';
export { Streams } from './Streams.js';

export {
    AuthorizationMiddleware,
    CriteriaMiddleware,
    ETagMiddleware,
    Middleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware,
} from './middleware/index.js';

// Make available globally if in browser
if (typeof window !== 'undefined') {
    window.streams_api = {
        Client,
        Criteria,
        Entries,
        FetchError,
        FetchHeaders,
        FetchRequest,
        Resource,
        Streams,
        AuthorizationMiddleware,
        CriteriaMiddleware,
        ETagMiddleware,
        Middleware,
        QueryMiddleware,
        RequestDataMiddleware,
        ResponseDataMiddleware,
    };
}
