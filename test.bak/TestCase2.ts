import 'reflect-metadata';
import { bootstrap, env } from './_support/bootstrap';
import { FS,  ProxyEnv } from './_support/utils';


export abstract class TestCase {

    static env: ProxyEnv<any> = env;
    env: ProxyEnv<any>        = env;
    FS: FS;

    async before() {
        this.FS  = new FS();
        this.env = env;
    }

    async after() {

    }

    static async before() {
        bootstrap();
    }

}
