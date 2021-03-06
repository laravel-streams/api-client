import 'reflect-metadata'
import { TestCase } from './TestCase';
import { suite, test } from '@testdeck/mocha';
import { Criteria, Stream } from '../src';
import { mock } from 'sinon';
import f from 'faker';

@suite
export class CriteriaTest extends TestCase {

    @test
    async 'test standardizeParameters'() {
        let stream   = mock(Stream);
        let criteria = new Criteria(stream as any);
        let compiled = criteria.where('a', 'foo')
                               .where('b', '>', 2)
                               .orderBy('b', 'asc')
                               .limit(4)
                               .standardizeParameters();
        compiled.should.be.an('array');
        for ( const stm of compiled ) {
            stm.should.be.an('object');
            let operation = Object.keys(stm)[ 0 ];
            stm[ operation ].should.be.an('array');
        }
    }

    @test
    async 'get clients where age above 5 and below 50, order by age and limit 10'() {
        this.createClientsStream();
        const streams = await this.getStreams();
        const stream  = await streams.make('clients');
        const entries = await stream.getEntries()
                                    .where('age', '>', 5)
                                    .where('age', '<', 50)
                                    .orderBy('age', 'asc')
                                    .get();
        for(const entry of entries.toArray<any>()){
            entry.id.should.be.a('number')
            entry.age.should.be.a('number');
            entry.age.should.be.above(4)
            entry.age.should.be.below(51)
        }
        return;
    }

    @test
    async 'get paginated clients where age above 5 and below 50, order by age'() {
        this.createClientsStream();
        const streams = await this.getStreams();
        const stream  = await streams.make('clients');
        const entries = await stream.getEntries()
                                    .where('age', '>', 5)
                                    .where('age', '<', 50)
                                    .orderBy('age', 'asc')
                                    .paginate();

        return;
    }

    createClientsStream() {
        this.fs.fixtures.copyStream('clients',this.fs.project)
        this.fs.project.generateFakeStreamEntries('clients', 100)
        // let entries = {};
        // this.createEntriesData(100).forEach(entry => entries[ entry.id ] = entry);
        // this.FS.create('streams/data/clients.json', entries);
    }

    createEntriesData(length: number) {
        return Array.from({length}, (_, index) =>{
            let name = `${f.name.firstName()} ${f.name.lastName()}`;

            return {
                id   : index + 1,
                name,
                email: f.internet.email(name),
                age  : f.datatype.number(100)
            };
        });
    }


}
