import { Middleware, MiddlewareOptions } from './Middleware';
import { Client } from '../Client';
import { FetchRequest } from '../FetchRequest';

export interface BasicAuthorizationMiddlewareOptions extends MiddlewareOptions {
    type: 'basic';
    username: string;
    password: string;
    btoa?: typeof btoa;
}

export interface BearerAuthorizationMiddlewareOptions extends MiddlewareOptions {
    type: 'bearer';
    token: string;
}

export type AuthorizationMiddlewareOptions =
    BasicAuthorizationMiddlewareOptions
    | BearerAuthorizationMiddlewareOptions & {}

export class AuthorizationMiddleware extends Middleware<AuthorizationMiddlewareOptions> {
    public static defaultOptions: Partial<AuthorizationMiddlewareOptions> = {
        btoa,
    };

    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( this.options.type === 'basic' ) {
            request.headers.basic(this.options.btoa(this.options.username + ':' + this.options.password));
        } else if ( this.options.type === 'bearer' ) {
            request.headers.bearer(this.options.token);
        }
        return request;
    }
}