---
sort_order: 1
title: Installation
description: 'Installing and setting up the Streams API Client'
category: getting-started
status: published
---

# Installation

## Requirements

- Node.js 14.0 or higher
- npm, yarn, or pnpm

## Installing via NPM

Install the package using your preferred package manager:

### NPM

```bash
npm install @laravel-streams/api-client
```

### Yarn

```bash
yarn add @laravel-streams/api-client
```

### PNPM

```bash
pnpm add @laravel-streams/api-client
```

## Installing from Source

### Cloning with Git

```bash
git clone git@github.com:laravel-streams/api-client.git
cd api-client
npm install
npm run build
```

### Building from Source

```bash
# Install dependencies
npm install

# Build the distribution files
npm run build

# Run tests to verify
npm test
```

## Package Contents

After installation, the package includes:

```
node_modules/@laravel-streams/api-client/
├── dist/
│   ├── index.js        # CommonJS build
│   └── module.js       # ES Module build
├── src/
│   ├── Client.js
│   ├── Criteria.js
│   ├── Entries.js
│   ├── Streams.js
│   └── middleware/
└── package.json
```

## Importing the Client

### ES Modules (Recommended)

```javascript
import { Client, Criteria } from '@laravel-streams/api-client';
```

### CommonJS

```javascript
const { Client, Criteria } = require('@laravel-streams/api-client');
```

### Browser (ES Modules)

```html
<script type="module">
import { Client } from './node_modules/@laravel-streams/api-client/dist/module.js';

const client = new Client({
    baseURL: 'http://localhost/api'
});
</script>
```

## Updating

Update to the latest version:

```bash
npm update @laravel-streams/api-client
```

Or update to a specific version:

```bash
npm install @laravel-streams/api-client@3.0.0
```

## Verifying Installation

Create a simple test file to verify the installation:

```javascript
// test-install.mjs
import { Client, Criteria } from '@laravel-streams/api-client';

console.log('✓ Client imported:', typeof Client);
console.log('✓ Criteria imported:', typeof Criteria);

const client = new Client({ baseURL: 'http://localhost/api' });
console.log('✓ Client created successfully');
```

Run it:

```bash
node test-install.mjs
```

Expected output:

```
✓ Client imported: function
✓ Criteria imported: function
✓ Client created successfully
```

## Next Steps

- [Quick Start Guide](02-quickstart.md) - Get up and running quickly
- [Client Configuration](03-client.md) - Configure the client for your needs
- [Working with Entries](05-entries.md) - Start interacting with your data
