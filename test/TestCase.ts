import 'reflect-metadata'
import { bootstrap } from './_support/bootstrap';
import { Http, Stream, Streams} from '../src';
import { FS, getEnv, ProxyEnv } from './_support/utils';
import { env} from './_support/bootstrap';
import 'node-fetch'

export abstract class TestCase {

    static env:ProxyEnv<any>=env
    env:ProxyEnv<any>=env
    fs: FS;

    async before() {
        this.fs = new FS();
        this.env = env
    }

    static async before() {
         bootstrap();
    }


    protected async getHttp(): Promise<Http> {
        return this.getStreams().http
    }

    protected getStreams():Streams {
        return new Streams({
            baseURL: this.env.get('APP_URL', 'http://localhost') + '/' + this.env.get('STREAMS_API_PREFIX', 'api'),
        })
    }
    protected async getStream(id:string): Promise<Stream> {
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
