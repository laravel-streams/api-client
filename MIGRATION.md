# Migration Guide - TypeScript to JavaScript

## What Changed

The Laravel Streams API Client has been simplified and converted from TypeScript to native JavaScript. This eliminates build complexity while maintaining all the core functionality.

## Key Improvements

✅ **No more TypeScript** - Pure JavaScript, no compilation needed for development
✅ **Simplified dependencies** - Only Parcel for bundling (down from 50+ dev dependencies)
✅ **Same API** - All classes and methods work exactly the same
✅ **Smaller bundle** - ~22KB CommonJS, ~21KB ESM (unminified)
✅ **ES Modules** - Modern import/export syntax throughout
✅ **Zero runtime dependencies** - Removed axios and qs, using native fetch

## File Structure Changes

### Before (TypeScript)
```
src/
  *.ts files
  types/
  middleware/
```

### After (JavaScript)  
```
src-js/
  *.js files
  middleware/
```

## Code Migration

### Import Statements

**Before:**
```typescript
import { Streams } from '@laravel-streams/api-client'
import type { StreamsConfiguration } from '@laravel-streams/api-client'
```

**After:**
```javascript
import { Client } from '@laravel-streams/api-client'
// No type imports needed!
```

### Client Initialization

**Before:**
```typescript
const streams = new Streams({
    baseURL: 'http://127.0.0.1/api'
});
```

**After:**
```javascript
const client = new Client({
    baseURL: 'http://127.0.0.1/api'
});
```

### Using Criteria

No changes - works exactly the same!

```javascript
const criteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .orderBy('created_at', 'desc')
    .limit(10);

const entries = await client.entries.get('posts', { criteria });
```

### Middleware

**Before:**
```typescript
import { AuthorizationMiddleware } from '@laravel-streams/api-client';

const auth = new AuthorizationMiddleware({
    token: 'token',
    type: 'Bearer'
});
```

**After:**
```javascript
import { AuthorizationMiddleware } from '@laravel-streams/api-client';

const auth = new AuthorizationMiddleware({
    token: 'token',
    type: 'Bearer'
});
```

Same code! Just without type annotations.

## Breaking Changes

### 1. Main Class Renamed
- `Streams` → `Client` (more descriptive)

### 2. Dependencies Removed
- No longer depends on `axios` - uses native `fetch`
- No longer depends on `qs` - uses built-in query string builder

### 3. Type Definitions
- No TypeScript `.d.ts` files (can be added later if needed)
- JSDoc comments can provide IntelliSense in VS Code

## What Stayed the Same

✅ All API methods (get, find, post, patch, put, delete)
✅ Criteria query builder interface
✅ Middleware system
✅ Request/Response handling
✅ Error handling with FetchError
✅ Custom headers with FetchHeaders

## NPM Scripts

**Before:**
```json
{
  "build": "tsc && parcel build",
  "dev": "tsc --watch"
}
```

**After:**
```json
{
  "build": "parcel build",
  "dev": "parcel src-js/index.html",
  "clean": "rm -rf dist .parcel-cache"
}
```

## Testing the Migration

1. Remove old dependencies:
```bash
rm -rf node_modules package-lock.json
```

2. Install new dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run the test:
```bash
node test-simple.js
```

## Rollback Instructions

If you need to revert to the TypeScript version:

```bash
mv package.json.old package.json
rm -rf node_modules package-lock.json
npm install
```

The original TypeScript source files are still in the `src/` directory.

## Questions?

Check out:
- `examples.js` - Comprehensive usage examples
- `test-simple.js` - Basic functionality test
- `README.md` - Updated documentation

## Future Enhancements

While we've simplified the codebase, we can still add:
- JSDoc comments for better IDE support
- Optional TypeScript `.d.ts` declaration files
- More comprehensive test suite
- Additional middleware options

The goal was to make it simple and maintainable while preserving all the functionality you need!
