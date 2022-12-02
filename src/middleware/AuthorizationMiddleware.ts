import { Middleware } from './Middleware';
import { Client } from '../Client';
import { FetchRequest } from '../fetch/FetchRequest';

export interface BasicAuthorizationMiddlewareOptions {
    type: 'basic';
    username: string;
    password: string;
}

export interface BearerAuthorizationMiddlewareOptions {
    type: 'bearer';
    token: string;
}

export type AuthorizationMiddlewareOptions =
    BasicAuthorizationMiddlewareOptions
    | BearerAuthorizationMiddlewareOptions

export class AuthorizationMiddleware extends Middleware {
    constructor(public options: AuthorizationMiddlewareOptions) {
        super();
    }

    public async request(request: FetchRequest, client: Client): Promise<FetchRequest> {
        if ( this.options.type === 'basic' ) {
            request.headers.basic(this.options.username, this.options.password);
        } else if ( this.options.type === 'bearer' ) {
            request.headers.bearer(this.options.token);
        }
        return request;
    }
}