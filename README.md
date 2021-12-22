# Streams JS Client Api

[Api Docs](https://laravel-streams.github.io/api-js/)

A cohesive development system for building, administrating, and interacting with data-driven Laravel applications.

## Intro
todo

## Examples

### Setup
```ts
import { Streams } from '@laravel-streams/streams-api';

const streams = new Streams({
    baseURL: 'http://localhost/api',
});


async function run(){
    const stream = await streams.make('clients')
    const clients = await stream.entries()
                                .where('age', '>', 5)
                                .where('age', '<', 50)
                                .orderBy('age', 'asc')
                                .get();
    for(const client of clients){
        client.email;
        client.age;
    }
}
```

### Extending
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


## Variants
Streams API comes with several bundles. You can use your bundle (eg webpack)  to let it resolve to the appropriate one.


### File size analysis
| File | Bundled | Minified | Gziped | Rollup | Webpack | Import Statements |
| :------------------------------------------|:---------|:----------|:--------|:--------|:---------|:------------------- |
| streams-api.nodedeps.min.esm-browser.js | 224.18 kB | 110.45 kB | 27.85 kB | 71.96 kB | 76.33 kB | 52 |
| streams-api.esm-browser.js | 693.56 kB | 282.45 kB | 77.48 kB | 219.36 kB | 222.44 kB | 0 |
| streams-api.nodedeps.esm-browser.js | 224.18 kB | 110.45 kB | 27.85 kB | 71.96 kB | 76.33 kB | 52 |
| streams-api.min.esm-browser.js | 693.56 kB | 282.45 kB | 77.48 kB | 219.36 kB | 222.44 kB | 0 |


