import { Client } from '../Client';
import { FetchRequest } from '../fetch/FetchRequest';
import { ClientResponse } from '../types';
import { FetchError } from '../FetchError';
import { isObject, mergeObjects } from '../utils';

export interface MiddlewareOptions {
    priority?: {
        request?: number,
        response?: number,
        error?: number
    };
    // before?: typeof Middleware[];
    // after?: typeof Middleware[];
}

export abstract class Middleware<T extends MiddlewareOptions = MiddlewareOptions> {
    options: T;

    public static defaultOptions: MiddlewareOptions | any = {
        priority: {
            request : 50,
            response: 50,
            error   : 50,
        }
    };

    constructor(options?: T) {
        this.options = new.target.getDefaultOptions(new.target, options);
    }

    public static get(middlewares: Middleware[], kind: 'request' | 'response' | 'error'): Middleware[] {
        return middlewares
        .filter(middleware => typeof middleware[kind] === 'function')
        .sort((a, b) => {
            return a.options.priority[ kind ] - b.options.priority[ kind ];
        });
    }

    public static async run(client: Client, target: any, kind: 'request' | 'response' | 'error') {
        const middlewares = Middleware.get(client.middlewares, kind);
        for ( const middleware of middlewares ) {
            target = await middleware[kind](target, client);
        }
        return target;
    }

    public static getDefaultOptions(t: any, options: any = {}): any {
        if ( isObject(t.defaultOptions) ) {
            options = mergeObjects(t.defaultOptions, options);
        }
        let parent = Object.getPrototypeOf(t);
        if ( parent && isObject(parent.defaultOptions) ) {
            options = this.getDefaultOptions(parent, options);
        }
        return options;
    }

    public priority(priority: number, kind?: 'request' | 'response' | 'error' | false | null) {
        let kinds = [ 'request', 'response', 'error' ];
        kind      = kind !== undefined && kinds.includes(kind.toString()) ? kind : false;

        if ( !kind ) {
            kinds.forEach(kind => this.options[ kind ] = priority);
        } else {
            this.options[ kind ] = priority;
        }
        return this;
    }

    public request?(request: FetchRequest, client: Client): Promise<FetchRequest>

    public response?(response: ClientResponse, client: Client): Promise<ClientResponse>

    public error?(error: FetchError, client: Client): Promise<FetchError>
}