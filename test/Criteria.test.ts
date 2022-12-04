import { suite, test } from '@testdeck/mocha';
import { TestCase } from './TestCase';
import { Criteria } from '../src';


@suite('Criteria')
export class CriteriaTest extends TestCase {
    @test
    async 'paginate stream'() {
        const client   = this.getClient(true);
        // const response = await client.request('get','streams', { criteria: Criteria.make().paginate(5) })
        const response = await client.request('get', 'streams', {
            params: {
                where: [
                    [ 'a', '==', 'b' ],
                    [ 'b', '==', "where it's always super & nice" ],
                ],
                limit: [
                    [0, 15],
                    [20,25]
                ],
                per_page:10,
                paginate:true
            },
        });

        return response;
    }


}
