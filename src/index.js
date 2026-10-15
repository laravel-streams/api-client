import { Auth } from './Auth.js';
import { Client } from './Client.js';
import { Criteria } from './Criteria.js';
import { Entries } from './Entries.js';
import { FetchError } from './FetchError.js';
import { FetchHeaders } from './FetchHeaders.js';
import { FetchRequest } from './FetchRequest.js';
import { Resource } from './Resource.js';
import { Streams } from './Streams.js';
import {
    MemoryTokenStorage,
    WebStorageTokenStorage,
    createTokenStorage,
    secureStorageAdapter,
} from './TokenStorage.js';

import {
    AuthorizationMiddleware,
    CriteriaMiddleware,
    ETagMiddleware,
    OrganizationMiddleware,
    Middleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware,
} from './middleware/index.js';

export {
    Auth,
    Client,
    Criteria,
    Entries,
    FetchError,
    FetchHeaders,
    FetchRequest,
    Resource,
    Streams,
    MemoryTokenStorage,
    WebStorageTokenStorage,
    createTokenStorage,
    secureStorageAdapter,
    AuthorizationMiddleware,
    CriteriaMiddleware,
    ETagMiddleware,
    OrganizationMiddleware,
    Middleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware,
};

// Make available globally if in browser
if (typeof window !== 'undefined') {
    window.streams_api = {
        Auth,
        Client,
        Criteria,
        Entries,
        FetchError,
        FetchHeaders,
        FetchRequest,
        Resource,
        Streams,
        MemoryTokenStorage,
        WebStorageTokenStorage,
        createTokenStorage,
        secureStorageAdapter,
        AuthorizationMiddleware,
        CriteriaMiddleware,
        ETagMiddleware,
        OrganizationMiddleware,
        Middleware,
        QueryMiddleware,
        RequestDataMiddleware,
        ResponseDataMiddleware,
    };
}
