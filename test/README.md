# Tests

This directory contains the test suite for the Laravel Streams API Client.

## Running Tests

```bash
npm test
```

## Test Files

- `Client.test.js` - Tests for the main Client class
- `Criteria.test.js` - Tests for the Criteria query builder
- `Middleware.test.js` - Tests for all middleware classes
- `Utils.test.js` - Tests for utility functions

## Test Coverage

The tests cover:

✅ Client initialization and configuration
✅ Middleware system and custom middleware
✅ Criteria query building with all operators
✅ Resource initialization (Streams, Entries)
✅ String utilities (Str class)
✅ Object merging and manipulation
✅ Query string building
✅ Custom Map utilities

## Adding Tests

To add new tests, create a new `*.test.js` file in this directory and follow the existing patterns:

```javascript
import { YourClass } from '../src/index.js';
import assert from 'assert';

describe('YourClass', () => {
    it('should do something', () => {
        // Your test here
        assert.ok(true);
    });
});
```

## Test Framework

Tests use Node.js built-in test runner and assertions. No external dependencies required.
