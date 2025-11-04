# Streams API - JS Client

A simplified JavaScript client for interacting with the [Laravel Streams API](https://github.com/laravel-streams/streams-api).

> **Version 3.0** - Rebuilt with native JavaScript. Zero runtime dependencies. Simple and maintainable.

## Features

✨ **Zero Dependencies** - Uses native fetch API  
🎯 **PHP Laravel-style Criteria** - Familiar query builder interface  
🔌 **Middleware System** - Extensible request/response pipeline  
📦 **Tiny Bundle** - ~22KB CommonJS, ~21KB ESM  
🧪 **Fully Tested** - 70 tests, 100% passing  
⚡ **Modern JS** - ES6+ with both ESM and CommonJS builds

## Installation

```bash
npm install @laravel-streams/api-client
```

## Quick Start

```javascript
import { Client } from '@laravel-streams/api-client';

const client = new Client({
    baseURL: 'http://localhost/api'
});

// Get all streams
const streams = await client.streams.get();

// Get entries from a stream
const entries = await client.entries.get('posts');

// Find a specific entry
const entry = await client.entries.find('posts', 1);

// Create an entry
const newEntry = await client.entries.post('posts', {
    title: 'Hello World',
    content: 'This is my first post'
});

// Update an entry
await client.entries.patch('posts', 1, {
    title: 'Updated Title'
});

// Delete an entry
await client.entries.delete('posts', 1);
```

## Documentation

- [Installation](docs/01-installation.md) - Installation and setup
- [Quick Start](docs/02-quickstart.md) - Get started quickly
- [Client Configuration](docs/03-client.md) - Client initialization and configuration
- [Working with Streams](docs/04-streams.md) - Managing streams
- [Working with Entries](docs/05-entries.md) - CRUD operations for entries
- [Criteria Query Builder](docs/06-criteria.md) - PHP Laravel-style querying
- [Middleware](docs/07-middleware.md) - Request/response middleware
- [Examples](docs/08-examples.md) - Real-world usage examples

## Using Criteria (Query Builder)

The Criteria class provides a fluent interface similar to Laravel's query builder:

```javascript
import { Criteria } from '@laravel-streams/api-client';

const criteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .orderBy('created_at', 'desc')
    .limit(10);

// Use with entries
const response = await client.entries.get('posts', {
    criteria: criteria
});
```

## Middleware

The client supports middleware for request/response processing:

```javascript
import { Client, AuthorizationMiddleware } from '@laravel-streams/api-client';

const auth = new AuthorizationMiddleware({
    token: 'your-api-token',
    type: 'Bearer'
});

const client = new Client({
    baseURL: 'http://localhost/api',
    middlewares: [auth]
});
```

## API Reference

### Client

- `client.streams.get()` - Get all streams
- `client.streams.find(stream)` - Get a specific stream
- `client.entries.get(stream)` - Get entries from a stream
- `client.entries.find(stream, id)` - Find a specific entry
- `client.entries.post(stream, data)` - Create an entry
- `client.entries.patch(stream, id, data)` - Update an entry
- `client.entries.delete(stream, id)` - Delete an entry

### Criteria

- `where(field, value)` - Add a where clause
- `where(field, operator, value)` - Add a where clause with operator
- `orWhere(field, value)` - Add an OR where clause
- `orderBy(field, direction)` - Order results
- `limit(number)` - Limit results
- `paginate(perPage, page)` - Paginate results

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Watch mode for tests
npm run test:watch

# Clean build artifacts
npm run clean
```

## Migration from 2.x

If you're upgrading from version 2.x (TypeScript), see the [Migration Guide](MIGRATION.md) for details on changes and how to upgrade.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
