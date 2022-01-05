import 'reflect-metadata'
import { TestCase } from './TestCase';
import { skip, suite, test } from '@testdeck/mocha';
import { Criteria, Stream } from '../src';
import { mock } from 'sinon';
import f from 'faker';

@suite('Repository')
export class RepositoryTest extends TestCase {

    @test @skip
    async 'find by id'() {

    }

}
