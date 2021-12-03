import { params, skip, suite, test } from '@testdeck/mocha';
import { TestCase } from './TestCase';
import { Field, Http, HTTPError, Stream } from '../src';
import { expect } from 'chai';



const invalid = {
    streams: {
        getAll :false,
        get   : false,
        post  : false,
        put   : true,
        patch : false,
        delete: false,
    },
    entries: {
        getAll:false,
        get   : false,
        post  : false,
        put   : true,
        patch : false,
        delete: false,
    }
};

@suite('Http')
export class HttpTest extends TestCase {
    protected get http(): Http {return this.getHttp();}

    @test('resolve HTTP instance')
    async resolveHttpInstance() {
        const http = this.getHttp();
        http.should.be.instanceof(Http);
    }

    @test('getting nonexistant stream should result in HTTPError')
    async gettingNonexistantStreamShouldResultInHttperror() {
        const http = await this.getHttp();
        try {
            const stream = await http.getStream('users2');
        } catch (e) {
            e.should.be.instanceof(HTTPError);
        }
    }

    @test('http.getStream')
    async getStreamsTest() {
        const http = this.getHttp();
        http.should.be.instanceof(Http);
        const stream = await http.getStream('users');
        stream.should.have.property('data');
    }

    @skip
    @test('http.postStream')
    async postStreamTest() {
        this.fs.project.deleteStream('clients')
        const http             = await this.getHttp();
        const { data: stream } = await http.postStream(this.getStreamDefinition('clients'));

        this.fs.project.hasStream('clients').should.eq(true);

        stream.should.have.property('data');
        stream.data.should.have.property('id');
        stream.should.have.property('links');
        stream.should.have.property('meta');
        stream.should.have.property('errors');

        const response = await http.deleteStream(stream.data.id);
        response.data.should.eq('');
        this.fs.project.hasStream('clients').should.eq(false);
    }

    @test('http.getStream')
    @skip(invalid.streams.get)
    @params({ name: 'clients' }, 'get stream "clients"')
    @params({ name: 'posts' }, 'get stream "posts"')
    async getStreamTest({ name }: { name: string }) {
        this.fs.fixtures.copyStream(name, this.fs.project)
        const stream = await this.http.getStream(name);
        stream.should.have.property('data');
        this.fs.project.deleteStream(name)
    }

    @test('http.patchStream()')
    @skip(invalid.streams.patch)
    async patchStreamTest(){
        this.fs.fixtures.copyStream('posts', this.fs.project);
        let res = await this.http.getStream('posts')
        res.should.have.property('data');
        res.data.data.description = 'foobarfoofoo';
        res = await this.http.patchStream('posts',res.data.data)
        res.should.have.property('data');
        res.data.data.description.should.equal('foobarfoofoo')
        this.fs.project.getStream('posts').get('description').should.eq('foobarfoofoo');
        this.fs.project.deleteStream('posts');
    }

    @test('put stream')
    @skip(invalid.streams.put)
    async putStreamTest() {
        await this.http.putStream('foobars', this.getStreamDefinition('foobars'));
    }

    @test('http.deleteStream(): should delete the stream')
    @skip(invalid.streams.delete)
    async deleteStreamTest() {
        this.fs.fixtures.copyStream('posts', this.fs.project)
        let response = await this.http.deleteStream('posts')
        response.should.eq(true);
        this.fs.project.hasStream('posts').should.eq(false);
    }

    @test('get entries')
    @skip(invalid.entries.getAll)
    async getEntriesTest() {
        this.fs.fixtures.copyStream('posts', this.fs.project)
        let response = await this.http.getEntries('posts')
        response.data.data
        this.fs.project.deleteStream('posts')
    }

    @test('post entry')
    @skip(invalid.entries.post)
    async postEntryTest() {
        this.fs.fixtures.copyStream('clients', this.fs.project)
        const http  = await this.getHttp();
        const entry = await http.postEntry('clients', {
            name : 'Robin',
            email: 'robin@robin.com',
        });
        return;
    }

    @test('get entry') @skip(invalid.entries.get)
    async getEntryTest() {}

    @test('patch entry') @skip(invalid.entries.patch)
    async patchEntryTest() {}

    @test('put entry') @skip(invalid.entries.put)
    async putEntryTest() {}

    @test('delete entry') @skip(invalid.entries.delete)
    async deleteEntryTest() {}

}
