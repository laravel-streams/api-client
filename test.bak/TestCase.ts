import { bootstrap, env } from './_support/bootstrap';
import {  ProxyEnv } from './_support/utils';
import { Client, Middleware } from '../src';


export abstract class TestCase {

    static env: ProxyEnv<any> = env;
    env: ProxyEnv<any>        = env;

    async before() {
        this.env = env;
    }

    async after() {

    }

    static async before() {
        bootstrap();
    }

    protected getClient(){
        let headers={};
        let params={};
        let middlewares=[];
        if(this.env.get('XDEBUG', false)){
            params['XDEBUG_SESSION']='phpstorm';
        }
        return new Client({
            baseURL: this.env.get('API_URL','http://localhost') + '/' + env.get('STREAMS_API_PREFIX', 'api'),
            request: {
                headers,
                query: params
            },
            middlewares
        });
    }
}
