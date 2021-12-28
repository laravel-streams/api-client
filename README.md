# Streams JS Api Client

A cohesive development system for building, administrating, and interacting with data-driven Laravel applications.

> This is not a Laravel Streams addon. This is a NPM package that decoupled websites can use to interact with the backend server.

## Documentation
The [full documentation can be found here](https://laravel-streams.github.io/api-client)

### Installation & Configuration

Installation goes through any package manger capable of pulling packages from NPM.

```shell
yarn add @laravel-streams/api-client
```

```shell
npm install @laravel-streams/api-client
```

### USage

```ts
import { Streams } from '@laravel-streams/api-client'

export const streams = new Streams({
    // StreamsConfiguration
})
```

The [full documentation can be found here](https://laravel-streams.github.io/api-client)

## MIT License
Can be found [here](LICENSE.md);
