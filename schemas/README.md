# Committed streams:schema output

Every `*.schema.json` file here is the direct output of Laravel's
`streams:schema` command (`streams/sdk`) run against the fixture app in
[`fixture/`](fixture/). **Never edit these by hand.** They target
**`streams/api` `^1.0`** (installed as `1.0.x-dev` in `fixture/composer.json`).

The four streams are:

- `streams` — core-registered stream definitions
- `applications` — core-registered application definitions
- `todos` — the `todos` stream defined in the fixture
- `users` — the eloquent `users` stream defined in the fixture

## Regenerating

```bash
# Re-run streams:schema against the fixture and rewrite the files here
npm run types:schema

# Then rebuild the entry interfaces in types/entries.generated.d.ts
npm run types:generate
```

`scripts/generate-types.mjs` turns these `{id}.schema.json` files into the
`*Entry` interfaces and the `StreamId` / `StreamEntryMap` types exported by
`src/index.d.ts`. CI ([`.github/workflows/types.yml`](../.github/workflows/types.yml))
regenerates everything on every PR and fails if the committed `types/` drift
from the schema output.

Note: `streams:schema` includes dynamic `default` values (uuids, timestamps)
that change on every run. The generated TypeScript ignores defaults, so
`npm run types:check` only diffs the stable `types/` output.
