import { params, suite, test } from '@testdeck/mocha';
import { TestCase } from './TestCase';
import { Client } from '../src';


@suite('Client')
export class ClientTest extends TestCase {

    @test
    async 'create'() {
        const client = this.getClient()
        client.should.be.instanceOf(Client);
    }


    @test
    async 'get streams'() {
        const client = this.getClient();
        const streams = await client.streams.get();


        return;
    }


}
