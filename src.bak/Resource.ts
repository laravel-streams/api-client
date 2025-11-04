import { Client } from './Client';


export abstract class Resource {
    constructor(protected client:Client) {

    }
}