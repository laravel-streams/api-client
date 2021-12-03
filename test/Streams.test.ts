import { params, suite, test } from '@testdeck/mocha';
import { TestCase } from './TestCase';
import { Entry, Field, Streams } from '../src';


@suite
export class StreamsTest extends TestCase {

    @test('new Streams(): create a new Streams api instance')
    async resolveStreamsInstanceTest() {
        const streams = this.getStreams();
        streams.should.be.instanceof(Streams);
    }

    @test('stream.make(): get a stream and create an entry')
    async makeStreamTest() {
        this.fs.fixtures.copyStream('clients', this.fs.project);
        const streams = await this.getStreams();
        const stream  = await streams.make('clients');
        stream.id.should.eq('clients');
        const fields = Object.fromEntries(stream.fields.entries());
        fields.id.should.be.instanceof(Field);
        const entry = await stream.repository.create({
            id   : 1,
            name : 'robin',
            email: 'robin@robin.com',
        });
        entry.should.be.instanceof(Entry);
        const entries = await stream.repository.all();

        this.fs.project.deleteStream('client');
    }

    @test('stream.repository.create(): get a stream and use the its repository to create an entry')
    async makeStreamRepositoryEntry() {
        this.fs.fixtures.copyStream('clients', this.fs.project);
        const streams = await this.getStreams();
        const stream  = await streams.make('clients');
        stream.id.should.eq('clients');
        const fields = Object.fromEntries(stream.fields.entries());
        fields.id.should.be.instanceof(Field);
        const entry = await stream.repository.create({
            id   : 1,
            name : 'robin',
            email: 'robin@robin.com',
        });
        entry.should.be.instanceof(Entry);
        this.fs.project.deleteStream('client');
    }

    @test('stream.save() add field to stream and save the stream')
    async saveStreamTest() {
        this.fs.fixtures.copyStream('posts', this.fs.project);
        const stream = await this.makeStream('posts');
        stream.fields.set('foo', new Field({
            handle: 'foo',
            type  : 'boolean',
        }));
        const saved = await stream.save();
        saved.should.eq(true);

        this.fs.project.getStream('posts').has('fields.foo').should.eq(true);
        this.fs.project.deleteStream('posts');
    }

    @test('stream.delete(): A stream should be able to be deleted')
    async deleteStreamTest() {
        this.fs.fixtures.copyStream('posts', this.fs.project);
        const stream   = await this.makeStream('posts');
        const response = await stream.delete();
        response.should.eq(true);
        this.fs.project.hasStream('posts').should.eq(false);
    }


    @params({ arg1: 'foo', arg2: 'bar' })
    @params.pending({ arg1: 'bar', arg2: 'foo' }, 'SUT does not yet support this')
    'test foobar against parameters'({ arg1, arg2 }) {
    }


}
