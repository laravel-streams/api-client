# Streams JS Api Client

A cohesive development system for building, administrating, and interacting with data-driven Laravel applications.

> This is not a Laravel Streams addon. This is a NPM package that decoupled websites can use to interact with the backend server.

The Typedoc [API docs can be found here](api/index.html){target="_blank"}

1. [The upper layer](#the-upper-layer)
    1. [Installation & configuration](#installation--configuration)
    2. [Working with the Streams instance](#working-with-the-streams-instance)
    3. [Getting, modifying and creating streams](#getting-modifying-and-creating-streams)
    4. [Getting Stream entries using the Stream Repository](#getting-stream-entries-using-the-stream-repository)
    5. [Getting Stream entries using the Stream Criteria](#getting-stream-entries-using-the-stream-criteria)
    7. [Working with a Entry instance. Reading, updating and deleting data.](#working-with-a-entry-instance-reading-updating-and-deleting-data)
2. [The lower layer](#the-lower-layer)
    1. [Working with the HTTP instance](#working-with-the-http-instance)
    2. [Creating Requests](#creating-requests)
    3. [Reading Responses & Handling Errors](#reading-responses--handling-errors)
3. [The extras](#the-extras)
    1. [Generate type definitions for streams, entries etc](#generate-type-definitions-for-streams-entries-etc)
    2. [Extending, hooks and hacking the library.](#extending-hooks-and-hacking-the-library)
    3. [The various bundles that come with the package.](#the-various-bundles-that-come-with-the-package)
        1. [How to choose the right one](#how-to-choose-the-right-one)
        2. [How to configure that in Webpack/Mix/Rollup](#how-to-configure-that-in-webpackmixrollup)
4. [MIT License](#mit-license)
## The upper layer

### Installation & Configuration

Installation goes through any package manger capable of pulling packages from NPM.

```shell
yarn add @laravel-streams/api-client
```

```shell
npm install @laravel-streams/api-client
```

Once that's done there's several ways of getting the package into your code. In most cases this will be webpack. Further information on the various bundles and how to use them is documented at the end of the document

For now, let's asume you use webpack. Create a `streams.ts/js` somewhere like this:

```ts
import { Streams } from '@laravel-streams/api-client'

export const streams = new Streams({
    // StreamsConfiguration
})
```

The StreamsConfiguration has one required option and one optional:

- **baseURL** `string` _[required]_ The url that points to the api, eg `http://127.0.0.1/api`
- **request** `AxiosRequestConfig` The base HTTP Request configuration. This is similar to Axios configuration
- **etag** `ETagConfiguration` The base HTTP Request configuration. This is similar to Axios configuration

### Working with the streams instance
```ts
import { Collection, Entry, EntryCollection, Field, Stream, Streams, Response, Request } from '@laravel-streams/api-client';

async function WorkingWithTheStreamsInstance() {
    const streams = new Streams({
        baseURL: '',
    });
}
```

### Getting, modifying and creating streams
```ts
async function GettingModifyingStreams(streams: Streams) {
    // Getting a stream
    const stream: Stream = await streams.make('clients');

    // Deleting a stream
    await stream.delete();

    // Modifying a stream
    stream.description = 'Foobar';
    stream.getFields().put('foo', new Field({
        handle: 'foo',
        type  : 'boolean',
    }));
    await stream.save();


    // Getting all the streams in a array
    const streamEntriesInArray: Stream[] = await streams.all();

    // Getting all the streams in a Collection
    const streamEntriesInCollection: Collection<Stream> = await streams.collection();

}
async function CreatingStreams(streams: Streams) {
    // Creating a stream
    const stream: Stream = await streams.create('clients', {
        name       : 'Clients',
        description: 'Client information',
        fields     : {
            title: 'string',
            age  : {
                type : 'number',
                rules: [],
            },
        },
    });
}

```

### Getting Stream entries using the Stream Repository
```ts
async function WorkingWithAStreamRepository(streams: Streams, stream: Stream) {
    //  Getting Stream entries using the Stream Repository
    const entry: Entry = await stream.getRepository().find(1);
    await stream.getRepository().all();
    await stream.getRepository().delete(entry);
    await stream.getRepository().save(entry);
    const createdEntry: Entry = await stream.getRepository().create({
        title: 'The greatest',
        age  : 245,
    });

    // The EntryCollection is a class that extends the Collection class from 'collect.js'.
    // The methods and functionality are much alike the Illuminate\Support\Collection class.
    const entries: EntryCollection = await stream.getRepository().findAll([ 1, 2, 3, 64 ]);
    const first: Entry             = entries.first();
}

```
### Getting Stream entries using the Stream Criteria
```ts
async function WorkingWithAStreamCriteria(streams: Streams, stream: Stream) {
    //  Getting Stream entries using the Stream Criteria
    const criteria                    = stream.getEntries();
    const collection: EntryCollection = await criteria.where('age', '>', 5)
                                                      .where('age', '<', 50)
                                                      .orderBy('age', 'asc')
                                                      .get();
    const paginated: EntryCollection = await criteria.where('age', '>', 5)
                                                     .where('age', '<', 50)
                                                     .orderBy('age', 'asc')
                                                     .paginate(100, 1);
}

```
### Working with a Entry instance. Reading, updating and deleting data.
```ts
async function WorkingWithAEntryInstance_ReadingUpdatingAndDeletingData(entry:Entry, streams: Streams, stream: Stream) {
    /**
     * You can modify the values of the entry and save them
     */
    entry.age = 12;
    await entry.save();

    await entry.delete()

    /**
     * You can also get a plain JS object with all values
     */
    const obj: object = entry.serialize();
}


```


## The lower layer
### Working with the HTTP instance
```ts
async function WorkingWithTheHTTPInstance(streams:Streams) {
    const response:Response = await streams.http.getStream('clients')

}
```

### Creating Requests
```ts
async function createingRequests(streams:Streams) {
    const request: Request = streams.createRequest()
    // merge config
    request.mergeConfig({
        url   : '',
        method: 'POST',
        params: {
            a: 'b'
        }
    })
    // direct config modification
    request.config.method = 'POST'
    // setting authentication
    request.authorization('Bearer', 'tokenhash')
    request.bearer('tokenhash')
    request.basic('username', 'password')
    // seting etag
    request.IfNoneMatch('etag')
    // setting headers
    request.header('If-Modified-Since', '')
```

### Reading Responses & Handling errors
```ts
    // sending request, getting response
    try {
        const response = await request.send();
        response.hasHeader('Content-Type')
        response.getHeader('Content-Type')
        if ( !response.ok ) {
            response.statusText;
        }
        response.data;
    } catch(e) {
        // handle error
    }
}
```

## The extras
### Generate type definitions for streams, entries etc
todo

### Extending, hooks and hacking the library.
Several classes contain [hooks](https://github.com/webpack/tapable).

More information will be provided before final release. The [Api Docs](https://laravel-streams.github.io/api-js/) will also cover these.
```ts
import { Streams } from '@laravel-streams/streams-api';

const streams = new Streams({
    baseURL: 'http://localhost/api',
});

streams.hooks.createRequest.tap('NAME', request => {
    // alter request
    return request;
})
streams.hooks.request.tap('NAME', request => {
    // alter request
    return request;
})
streams.hooks.response.tap('NAME', (response,request) => {
    // alter response
    return response;
})
```


### The various bundles that come with the package.
Click on the file link will open a new window with the visualisation of the bundle.

[[filesize.md]]


#### How to choose the right one
All the `nodeps` versions do not contain `axios` and `qs`, as such they are `peerDependencies` in case you
already have those installed. This means that:

**global**
Call the `streamsApi` function like below. Provide `axios` and `qs`. It will return all exported object in the streams api client library.
`const StreamsApi = streamsApi({}, axios, qs)`

**cjs**
You need to have both `axios` and `qs` installed. Then you can
`const streamApi = require('@laravel-streams/api-client')`

**esm-bundler**
Same deal as **cjs**. Make sure both are installed.


#### How to configure that in Webpack/Mix/Rollup
So, by default the `streams-api.esm-bundler.js` will be used, which have both `axios` and `qs` bundled into it.
In order to use the `streams-api.nodeps.esm-bundler.js` you'll have to make an alias in webpack:
```js
module.exports = {
    // webpack config
    resolve: {
        aliases: {
            '@laravel-streams/api-client$': '@laravel-streams/api-client/dist/streams-api.nodeps.esm-bundler.js'
        }
    }
}

```

## MIT License
Can be found [here](LICENSE.md);
