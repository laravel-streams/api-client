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

    @test
    async 'get stream "docs"'() {
        const client = this.getClient();
        const stream = await client.streams.find('docs');
        return;
    }

    @test
    async 'get stream "docs" entries'() {
        const client = this.getClient();
        const entries = await client.entries.get('docs', {
            page: 1,
            per_page: 3,
            limit: 13,
            where: {
                created_on: Date.now()
            },
            constraint: {
                created_on: '<'
            },
        });
        return;
    }

    @test
    async 'query stream "docs" entries'() {
        const client = this.getClient();

        const entries = await client.entries.query('docs', [
            {where: ['created_on','<',Date.now()]}
        ]);
        return;
    }


}
