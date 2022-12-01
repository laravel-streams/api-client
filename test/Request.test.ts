import 'reflect-metadata'
import { TestCase } from './TestCase';
import { skip, suite, test } from '@testdeck/mocha';
import { Criteria, Stream } from '../src2';
import { mock } from 'sinon';
import f from 'faker';

@suite('Request')
export class RequestTest extends TestCase {

    @test
    async 'Check parameters'() {
        this.fs.fixtures.copyStream('members', this.fs.project)
        this.fs.project.generateFakeStreamEntries('members',20);
        let generatedEntries = this.fs.project.getStreamEntries('members');


        const streams = this.getStreams()
        const stream = await streams.make('members')
        const criteria = stream.getEntries()

        const entries = await criteria.where('role','contributor')
            .where('status', '!=', 'denied')
            .orderBy('id','desc')
            .get();

        const objs = entries.toObject();

        const parameters = criteria.getParameters();
        const compiled = criteria.compileParameters();

        const temp = {parameters, compiled}

        this.fs.project.deleteStream('clients')
    }

}
