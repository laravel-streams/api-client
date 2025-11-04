import {Client} from './Client';
import { AuthorizationMiddleware,Middleware,ETagMiddleware,ResponseDataMiddleware } from './middleware';
import { FetchRequest } from './FetchRequest';
import { FetchHeaders } from './FetchHeaders';
import { Criteria } from './Criteria';

export * from './middleware'
export {Client,FetchHeaders,FetchRequest,Middleware,ETagMiddleware,ResponseDataMiddleware,Criteria};

// @ts-ignore
global['streams_api'] = {Client,AuthorizationMiddleware,FetchHeaders,FetchRequest,Middleware,ETagMiddleware,ResultDataMiddleware: ResponseDataMiddleware,Criteria};

interface Window {
    streams_api: typeof import('./index')
// {
//         Client: typeof Client
//         AuthorizationMiddleware:typeof AuthorizationMiddleware
//         FetchHeaders:typeof FetchHeaders
//         FetchRequest:typeof FetchRequest
//         Middleware:typeof Middleware
//         ETagMiddleware:typeof ETagMiddleware
//         ResultDataMiddleware:typeof ResultDataMiddleware
//         Criteria:typeof Criteria
//     }
}