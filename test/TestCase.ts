import 'reflect-metadata';
import { bootstrap, env } from './_support/bootstrap';
import { Client, Http, Stream, Streams } from '../src';
import { FS, ProxyEnv } from './_support/utils';

export abstract class TestCase {

    static env: ProxyEnv<any> = env;
    env: ProxyEnv<any>        = env;
    fs: FS;

    async before() {
        this.fs  = new FS();
        this.env = env;
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
        if(this.env.get('APP_DEBUG','false') === 'true') {
            streams.client.hooks.createRequest.tap('XDEBUG', factory => {
                factory
                .param('XDEBUG_SESSION', 'PHPSTORM')
                .header('Cookie', 'XDEBUG_SESSION=start');

                return factory;
            });
        }
        return streams;
    }

    protected async getStream(id: string): Promise<Stream> {
        return await this.getStreams().make(id);
    }

    protected getStreamData(id: string) {
        return {
            id,
            'name'  : id,
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
        };
    }
}
