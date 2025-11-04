import { suite, test } from '@testdeck/mocha';
import { TestCase } from './TestCase';
import { Client, Criteria } from '../src';


@suite('Criteria')
export class CriteriaTest extends TestCase {
    @test
    async 'paginate stream with criteria'() {
        const client   = this.getClient();
        client.should.be.instanceOf(Client);
        return;
        const criteria = Criteria.make()
                                 .where('a', '==', 'b')
                                 .where('b', '==', 'where it\'s always super & nice')
                                 .paginate(3, 5);
        const response = await client.request('get', 'streams', {
            criteria,
            // query   : {
            //     where   : [
            //         [ 'a', '==', 'b' ],
            //         [ 'b', '==', 'where it\'s always super & nice' ],
            //     ],
            //     per_page: 10,
            //     paginate: true,
            // },
        });

        return response;
    }


}

