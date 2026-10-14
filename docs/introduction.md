---
title: 'Client: Introduction'
nav_title: Introduction
description: A zero-dependency JavaScript client for the Streams REST API.
section: packages
package: client
order: 10
tags: [client, introduction]
status: ready
---

`@laravel-streams/api-client` is a JavaScript client for the [Streams API](/docs/api/introduction). It wraps the API's stream and entry endpoints in a small fluent interface, with a Laravel-style criteria builder and a request/response middleware pipeline.

## What it is

- **Zero runtime dependencies.** It uses the native `fetch` API, and ships ESM (`dist/module.js`) and CommonJS (`dist/index.js`) builds.
- **Two resources.** `client.streams` for stream definitions and `client.entries` for entry CRUD.
- **Criteria builder.** `where`, `orWhere`, `orderBy`, `limit`, and `paginate`, compiled into the API's query parameters.
- **Middleware.** Request, response, and error hooks with priorities. The defaults serialize request bodies, compile criteria, append query strings, and unwrap the response envelope.

It is the JavaScript counterpart to the PHP [Streams SDK](/docs/sdk/introduction), but they are different things: the SDK is Artisan tooling for building a Streams app, and the client is a runtime library for consuming a Streams API from a browser or Node.

## Why it exists

The Streams API describes itself: every response carries links to related resources, and stream definitions are available over HTTP. The client lets front ends and Node services use that API without hand-writing `fetch` calls, query-string encoding, or envelope parsing, and it keeps the query vocabulary (`where`, `orderBy`, `paginate`) the same as the [criteria](/docs/core/criteria) you already use in PHP.

## How to use it

Install from npm (the current release is **3.0.0**):

```bash
npm install @laravel-streams/api-client
```

Point the client at your API prefix and query a stream:

```javascript
import { Client, Criteria } from '@laravel-streams/api-client';

const client = new Client({ baseURL: 'https://example.com/api' });

const streams = await client.streams.get();

const posts = await client.entries.get('posts', {
    criteria: new Criteria()
        .where('status', 'published')
        .orderBy('created_at', 'desc')
        .limit(10),
});

await client.entries.patch('posts', 1, { title: 'Updated title' });
```

The server side needs [streams/api](/docs/api/installation) installed and enabled. The API has no built-in authentication; your app decides who can call it (see [API authentication](/docs/api/authentication)).

## How to extend it

Add behavior by writing a middleware class and registering it with `client.use()`:

```javascript
import { Middleware } from '@laravel-streams/api-client';

class TenantHeader extends Middleware {
    async request(request, client) {
        request.headers.set('X-Tenant', 'acme');
        return request;
    }
}

client.use(new TenantHeader());
```

`AuthorizationMiddleware` sets a bearer token for you. See [Middleware](/docs/client/middleware) for priorities and the error hook.

## Where to next

- [Installation](/docs/client/installation)
- [Quick start](/docs/client/quickstart)
- [Client configuration](/docs/client/client)
- [Criteria query builder](/docs/client/criteria)
