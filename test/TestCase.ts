import 'reflect-metadata';
import { bootstrap, env } from './_support/bootstrap';
import { Http, Stream, Streams } from '../src2';
import { FS, fs, ProxyEnv } from './_support/utils';
import { StreamsConfiguration } from '../src2';


export abstract class TestCase {

    static env: ProxyEnv<any> = env;
    env: ProxyEnv<any>        = env;
    FS: FS;
    fs                        = fs;

    async before() {
        this.FS  = new FS();
        this.env = env;
    }

    async after() {

    }

    static async before() {
        bootstrap();
    }


    protected getHttp(): Http {
        return this.getStreams().http;
    }

    protected getStreams(config:Partial<StreamsConfiguration>={}): Streams {
        let streams = new Streams({
            baseURL: this.env.get('APP_URL', 'http://localhost') + '/' + this.env.get('STREAMS_API_PREFIX', 'api'),
            ...config
        });
        if ( this.env.get('APP_DEBUG', 'false') === 'true' ) {
            streams.hooks.createRequest.tap('DEBUG', request => {
                request.hooks.createAxios.tap('DEBUG', axios => {
                    axios.interceptors.request.use(config => {
                        config.headers                    = config.headers || {};
                        config.headers[ 'Cookie' ]        = 'XDEBUG_SESSION=start';
                        config.params                     = config.params || {};
                        config.params[ 'XDEBUG_SESSION' ] = 'PHPSTORM';
                        return config;
                    });
                    return axios;
                });
                return request;
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
                id             : 'foobars',
                'name'         : 'foobars',
                'description'  : 'Explore the feature, functions, and operating principles of Laravel Streams.',
                'routes.view'  : {
                    'uri': '/foobars/{id}',
                },
                'translatable' : true,
                'source.format': 'md',
                'fields'       : {
                    'id'   : 'number',
                    'name' : 'string',
                    'email': 'email',
                    'age'  : 'number',

                    'options': {
                        'type': 'array',
                    },
                    'links'  : {
                        'type': 'array',
                    },
                    'menu'   : {
                        'type': 'array',
                    },
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
