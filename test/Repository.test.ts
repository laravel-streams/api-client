import 'reflect-metadata'
import { TestCase } from './TestCase';
import { skip, suite, test } from '@testdeck/mocha';
import { Criteria, Stream } from '../src';
import { mock } from 'sinon';
import f from 'faker';

@suite('Repository')
export class RepositoryTest extends TestCase {

    @test
    async 'find by id'() {
        this.fs.fixtures.copyStream('clients', this.fs.project)
        this.fs.project.generateFakeStreamEntries('clients',20);
        let generatedClients = this.fs.project.getStreamEntries('clients');
        const streams = this.getStreams()
        const stream = await streams.make('clients')
        const repo = stream.getRepository();
        const client = await repo.find(5);
        const generatedClient=  generatedClients[5];
        client.id.should.equal(5);
        for(const key of Object.keys(generatedClient)){
            client[key].should.equal(generatedClient[key]);
        }
        this.fs.project.deleteStream('clients')
    }

}
