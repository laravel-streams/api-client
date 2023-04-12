import { Client } from './Client';
import { AuthorizationMiddleware, ETagMiddleware, Middleware, ResponseDataMiddleware } from './middleware';
import { FetchRequest } from './FetchRequest';
import { FetchHeaders } from './FetchHeaders';

export * from './middleware';
export { Client, FetchHeaders, FetchRequest, Middleware, ETagMiddleware, ResponseDataMiddleware };
//
// // @ts-ignore
// // global[ 'streams_api' ] = { Client, AuthorizationMiddleware, FetchHeaders, FetchRequest, Middleware, ETagMiddleware, ResponseDataMiddleware };
//
// interface Window {
//     streams_api: typeof import('./index');
// }