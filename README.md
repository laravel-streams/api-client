# Streams API - JS Client

A Javascript client for interacting with the [Streams API](https://github.com/laravel-streams/streams-api).

> This is not a Laravel Streams addon. Instead, this is an NPM package for decoupled websites to interact with the Streams API backend server.

## Documentation

The [full documentation can be found here](https://laravel-streams.github.io/api-client)

### Installation & Configuration

Installation goes through any package manager capable of pulling packages from NPM.

```shell
yarn add @laravel-streams/api-client
```

```shell
npm install @laravel-streams/api-client
```

### Usage

```ts
import { Streams } from '@laravel-streams/api-client'

export const streams = new Streams({
    // StreamsConfiguration
})
```

The [full documentation can be found here](https://laravel-streams.github.io/api-client)

## MIT License

Can be found [here](LICENSE.md);
