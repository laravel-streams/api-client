# Quick Start Guide

## Installation

```bash
npm install
npm run build
```

## Testing

Run the included tests to verify everything works:

```bash
# Test the source code (ES Modules)
node test-simple.mjs

# Test the built distribution (CommonJS)
node test-dist.cjs

# Run comprehensive examples
node examples.mjs
```

## Usage

### ES Modules (Modern)

```javascript
import { Client, Criteria } from './src-js/index.js';

const client = new Client({
    baseURL: 'http://localhost/api'
});

// Get entries
const entries = await client.entries.get('posts');
```

### CommonJS (Node.js)

```javascript
const { Client, Criteria } = require('./dist/index.js');

const client = new Client({
    baseURL: 'http://localhost/api'
});
```

### Browser (ES Modules)

```html
<script type="module">
import { Client } from './dist/module.js';

const client = new Client({
    baseURL: 'http://localhost/api'
});
</script>
```

## Building

```bash
# Clean and build
npm run clean
npm run build

# Watch mode for development
npm run watch
```

## What's Included

- ✅ **Client** - Main API client class
- ✅ **Criteria** - PHP Laravel-style query builder
- ✅ **Streams** - Stream resource management
- ✅ **Entries** - Entry CRUD operations
- ✅ **Middleware** - Request/response middleware system
- ✅ **FetchHeaders** - Custom header management
- ✅ **FetchError** - Enhanced error handling

## Documentation

- `README.md` - Main documentation
- `MIGRATION.md` - Migration from TypeScript
- `SUMMARY.md` - Complete project summary
- `examples.mjs` - Comprehensive usage examples

## Next Steps

1. Review the examples: `node examples.mjs`
2. Update the baseURL in your code
3. Add authentication if needed
4. Start making API calls!

Enjoy your simplified, native JavaScript API client! 🎉
