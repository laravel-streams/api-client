import {Client} from './Client';
import { AuthorizationMiddleware,Middleware,ETagMiddleware,ResultDataMiddleware } from './middleware';
import { FetchRequest } from './fetch/FetchRequest';
import { FetchHeaders } from './fetch/FetchHeaders';
export * from './middleware'
export {Client,FetchHeaders,FetchRequest,Middleware,ETagMiddleware,ResultDataMiddleware};

// @ts-ignore
global['streams_api'] = {Client,AuthorizationMiddleware,FetchHeaders,FetchRequest,Middleware,ETagMiddleware,ResultDataMiddleware};

interface Window {
    streams_api:{
        Client: typeof Client
        AuthorizationMiddleware:typeof AuthorizationMiddleware
        FetchHeaders:typeof FetchHeaders
        FetchRequest:typeof FetchRequest
        Middleware:typeof Middleware
        ETagMiddleware:typeof ETagMiddleware
        ResultDataMiddleware:typeof ResultDataMiddleware
    }
}