// noinspection ES6UnusedImports

import { Streams } from '../src';
import  '../test/_support/bootstrap';
import { getEnv, ProxyEnv } from '../test/_support/utils';
import { streams as _streams } from '../src';

const env: ProxyEnv<any> = getEnv();
const baseURL            = [
    env.get('APP_URL', 'http://localhost'),
    env.get('STREAMS_API_PREFIX', 'api'),
].join('/');
const streams            = new Streams({
    baseURL,
});


async function run(){
    const stream = await streams.make('vehicles')
    const entry = await stream.getEntries().first();
    entry.
}
run();
