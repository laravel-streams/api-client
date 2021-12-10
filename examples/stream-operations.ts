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
    let a = stream.id
    const vehicle = await stream.getEntries().first()
    const response = await streams.http.getEntries('vehicles')
    const response2 = await streams.http.getEntries(a)
    let entry = await stream.getEntries().first();
return entry;
    const fields = stream.getFields()
    const field = fields.first();
    field.serialize();
    const meta = stream.getMeta()

}
run();
