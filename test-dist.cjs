// Test the built distribution (CommonJS)
const { Client, Criteria } = require('./dist/index.js');

console.log('✓ CommonJS distribution loaded successfully');

const client = new Client({
    baseURL: 'http://localhost/api'
});

console.log('✓ Client created:', client.options.baseURL);

const criteria = new Criteria()
    .where('status', 'published')
    .limit(10);

console.log('✓ Criteria created with', criteria.getParameters().length, 'parameters');

console.log('\n✅ CommonJS build works correctly!');
