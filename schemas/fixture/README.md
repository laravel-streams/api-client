# Schema fixture

A minimal Laravel 10 app used only to produce real `streams:schema` output for
this package's generated entry types. It installs the actual Streams packages
and defines the `todos` and `users` streams (see [`streams/`](streams/)); the
core-registered `streams` and `applications` streams are also introspected.

| Package       | Constraint | Installed   |
|---------------|------------|-------------|
| `streams/api` | `^1.0`     | `1.0.x-dev` |
| `streams/core`| `^2.0`     | `2.0.x-dev` |
| `streams/sdk` | `^1.0`     | `1.0.x-dev` |

Bumping any of these changes what `streams:schema` emits, so regenerate the
committed schemas and entry types afterwards:

```bash
cd ../.. && npm run types:sync
```

This fixture is not a runnable app; it exists so CI and maintainers can
regenerate the schemas in [`schemas/`](../) with the real command rather than
hand-writing them.
