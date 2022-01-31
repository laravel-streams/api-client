import { suite, test } from '@testdeck/mocha';
import { TestCase } from './TestCase';
import { Http } from '../src';

@suite('ETag')
export class EtagTest extends TestCase {
    protected get http(): Http {return this.getHttp();}

    protected createRequest() {return this.getStreams().createRequest();}

    protected createAxios() {return this.createRequest().createAxios();}

    @test
    async 'axios got etag property defined'() {
        const axios = this.createAxios();
        axios.etag.should.not.be.undefined;
    }

    @test 'by default etag is not enabled'() {
        const axios = this.createAxios();
        axios.etag.isEnabled().should.equal(false);
    }

    @test 'you can manuall enable etags'() {
        const axios = this.createAxios();
        axios.etag.enableEtag();
        axios.etag.isEnabled().should.equal(true);
    }

    @test
    async 'using api with etag will use storage to cahce'() {
        const streams = this.getStreams({
            etag: {
                enabled: true,
            },
        });
        const request = streams.createRequest();
        const axios   = request.createAxios();
        axios.etag.isEnabled().should.equal(true);
        this.fs.fixtures.copyStream('posts', this.fs.project);
        const response = await streams.http.getEntries<any>('posts');
        response.hasHeader('ETag').should.equal(true);
        this.fs.project.deleteStream('posts');
    }
}
