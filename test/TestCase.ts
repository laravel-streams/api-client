import 'reflect-metadata';
import { bootstrap, env } from './_support/bootstrap';
import { Client, Http, Stream, Streams } from '../src';
import { FS,  ProxyEnv,fs } from './_support/utils';





export abstract class TestCase {

    static env: ProxyEnv<any> = env;
    env: ProxyEnv<any>        = env;
    FS: FS;
    fs=fs

    async before() {
        this.FS  = new FS();
        this.env = env;
    }

    async after(){

    }

    static async before() {
        bootstrap();
    }


    protected getHttp(): Http {
        return this.getStreams().http;
    }

    protected getStreams(): Streams {
        let streams = new Streams({
            baseURL: this.env.get('APP_URL', 'http://localhost') + '/' + this.env.get('STREAMS_API_PREFIX', 'api'),
            Client : Client,
            Http   : Http,
        });
        if ( this.env.get('APP_DEBUG', 'false') === 'true' ) {
            streams.client.hooks.createRequest.tap('XDEBUG', factory => {
                factory
                .param('XDEBUG_SESSION', 'PHPSTORM')
                .header('Cookie', 'XDEBUG_SESSION=start');

                return factory;
            });
        }
        return streams;
    }

    protected async makeStream(id: string): Promise<Stream> {
        return await this.getStreams().make(id);
    }

    protected getStreamDefinition<T>(id: string): T {
        const data: Record<string, any> = {
            foobars: {
                id      : 'foobars',
                'name'  : 'foobars',
                "description": "Explore the feature, functions, and operating principles of Laravel Streams.",
                "routes.view": {
                    "uri": "/foobars/{id}"
                },
                "translatable": true,
                "source.format": "md",
                'fields': {
                    'id'      : 'number',
                    'name'    : 'string',
                    'email'   : 'email',
                    'age'     : 'number',

                    "options": {
                        "type": "array"
                    },
                    "links": {
                        "type": "array"
                    },
                    "menu": {
                        "type": "array"
                    }
                },
            },
            clients: {
                id      : 'clients',
                'name'  : 'clients',
                'source': {
                    'type': 'file',
                },
                'fields': {
                    'id'      : 'number',
                    'name'    : 'string',
                    'email'   : 'email',
                    'age'     : 'number',
                    'relative': {
                        'type'  : 'relationship',
                        'config': {
                            'related': 'clients',
                        },
                    },
                },
                'ui'    : { 'table': { 'columns': [ 'id', 'email' ], 'buttons': { 'edit': { 'href': `cp/${id}/{entry.id}/edit` } } }, 'form': {} },
            },
        };
        return data[ id ];
    }
}
