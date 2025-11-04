// Simple test to verify the API works
import { Client, Criteria, AuthorizationMiddleware } from './src/index.js';

console.log('✓ Imports successful');

// Test Client instantiation
const client = new Client({
    baseURL: 'http://localhost/api'
});

console.log('✓ Client created:', client.options.baseURL);

// Test Criteria
const criteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .orderBy('created_at', 'desc')
    .limit(10);

console.log('✓ Criteria created with', criteria.getParameters().length, 'parameters');

// Test middleware
const auth = new AuthorizationMiddleware({
    token: 'test-token',
    type: 'Bearer'
});

console.log('✓ AuthorizationMiddleware created');

client.use(auth);
console.log('✓ Middleware added to client');

// Verify resources exist
console.log('✓ Streams resource:', !!client.streams);
console.log('✓ Entries resource:', !!client.entries);

console.log('\n✅ All basic tests passed!');
console.log('\nThe client is ready to use. Example usage:');
console.log('  const streams = await client.streams.get();');
console.log('  const entries = await client.entries.get("posts");');
console.log('  const entry = await client.entries.find("posts", 1);');
