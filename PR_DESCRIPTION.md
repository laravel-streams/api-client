# PR description: TypeScript types for `@laravel-streams/api-client`

This file is the committed draft of the PR description for landing the types
change on master (base `18b416d`). It is kept in the branch so the reviewer
can verify the task 65 acceptance criteria — in particular the task 104 gap
mapping — without opening the PR. Open the PR with this text as the body.

## Summary

`@laravel-streams/api-client` (v3.0.0, plain-JS ESM) ships TypeScript
declarations alongside the runtime:

- `src/index.d.ts` (the package `types` entry) declares `Client`, `Streams`,
  `Entries`, `Criteria`, `FetchError`, `FetchHeaders`, `FetchRequest`,
  `Resource`, `Middleware` and every exported middleware
  (`AuthorizationMiddleware`, `CriteriaMiddleware`, `ETagMiddleware`,
  `QueryMiddleware`, `RequestDataMiddleware`, `ResponseDataMiddleware`), and
  re-exports the generated entry types.
- The per-stream entry interfaces (`StreamId`, `StreamEntryMap`, and the
  generated `*Entry` types) are **generated** by
  `scripts/generate-types.mjs` from real `streams:schema` output committed
  under `schemas/` — never hand-written.
- The runtime stays plain JS. No TS rewrite, no TS build step in the bundle.

## Targeted `streams/api` version

This client targets **`streams/api` `^1.0`**. The committed schemas in
`schemas/` were generated from `streams/api` `1.0.x-dev` (see
`fixture/composer.json`, `schemas/README.md`, and README "TypeScript").

## Groups App gaps (task 104 / artifact 159) — mapping

Each gap from task 104 / artifact 159 ("Streams JS client findings for the
groups app", GVM Oct 13) is mapped to a shipped type, a follow-up task, or
out of scope:

| Gap | Disposition |
|-----|-------------|
| Typed entry calls (`entries.get('posts')` etc.) | **Shipped type.** `StreamId`, `StreamEntryMap` and the generated `*Entry` interfaces type every `Entries` method per stream id; a wrong stream id or payload field fails to compile. |
| The `X-Organization-ID` header | **Follow-up task 708.** The client needs an `OrganizationMiddleware`; types alone cannot add a header. (A prototype exists on branch `ops/run-137-a306`, not merged.) |
| Auth steps (token storage, 401 hook, magic-link helpers) | **Follow-up task 709.** Needs client auth helpers (`Auth.js`, `TokenStorage.js`); types alone cannot add runtime auth behavior. |
| Non-entry API calls (bespoke routes the app calls directly instead of `streams`/`entries`) | **Out of scope.** Covered by the endpoint registry task 215, which is explicitly out of scope for this types task. |

## CI drift check

- `npm run types:check` regenerates `types/entries.generated.d.ts` from the
  committed schemas and exits non-zero on any diff, so committed types cannot
  drift from `streams:schema` output.
- `.github/workflows/types.yml` runs `streams:schema` (against the committed
  fixture app) then `types:check`, plus `tsc --noEmit` and `npm test`, on
  every PR.
- `test/GenerateTypes.test.js` proves the generator turns the real committed
  schemas into the committed entry types (drift test included).

## Notes

- No release work: no tag, no version bump, no publish (out of scope for this
  task).
- Landing is via this reviewed PR only; no direct push to master.
