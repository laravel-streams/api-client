// Compile-time usage of the public API surface. Type-checked by
// `npm run types:check` (npx tsc --noEmit -p test/types/tsconfig.json).

import {
    Client,
    Criteria,
    Entries,
    Streams,
    FetchError,
    FetchRequest,
    AuthorizationMiddleware,
    CriteriaMiddleware,
    ETagMiddleware,
    Middleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware,
    type ApiResponse,
    type StreamId,
    type TodosEntry,
    type UsersEntry,
} from '@laravel-streams/api-client';

const client = new Client({
    baseURL: 'https://api.example.com',
    request: {
        timeout: 5000,
        retries: 2,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
    },
    middlewares: [
        new AuthorizationMiddleware({ token: 'secret-token', type: 'Bearer' }),
        new QueryMiddleware(),
        new RequestDataMiddleware(),
        new ResponseDataMiddleware(),
        new CriteriaMiddleware(),
        new ETagMiddleware(),
    ],
});

client.use(new AuthorizationMiddleware());

// Middleware can be reused and re-prioritized.
const query = new QueryMiddleware();
query.priority(90, 'request');
const base: Middleware = query;

const streams: Streams = client.streams;
const entries: Entries = client.entries;

async function exercise(): Promise<void> {
    const listResponse = await entries.get('todos');
    const todos: TodosEntry[] | undefined = listResponse.data?.data;

    const created = await entries.post('todos', { description: 'Buy milk' });
    const createdEntry: TodosEntry | undefined = created.data?.data;

    const found = await entries.find('users', 1);
    const user: UsersEntry | undefined = found.data?.data;

    const updated = await entries.patch('todos', 'entry-id', { completed: true });
    const updatedEntry: TodosEntry | undefined = updated.data?.data;

    await entries.put('todos', 'entry-id', { description: 'Renamed' });
    await entries.delete('todos', 'entry-id');

    const raw: ApiResponse = await client.request('GET', '/custom', { query: { filter: 'active' } });
    const status: number = raw.status;

    const streamId: StreamId = 'todos';
    void [todos, createdEntry, user, updatedEntry, status, streamId, streams];
}

const criteria = new Criteria()
    .where('status', 'published')
    .where('views', '>', 100)
    .orderBy('created_at', 'desc')
    .limit(10)
    .paginate(25, 1);

const compiled: string = criteria.compile();

async function catchValidation(): Promise<void> {
    try {
        await client.entries.post('todos', { description: '' });
    } catch (error) {
        if (error instanceof FetchError) {
            const httpStatus: number = error.status;
            const fieldErrors: Record<string, string[]> = error.errors;
            void [httpStatus, fieldErrors];
        }
    }
}

void [client, base, entries, criteria, compiled, catchValidation, exercise];
