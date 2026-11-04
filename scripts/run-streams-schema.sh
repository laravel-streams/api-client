#!/usr/bin/env bash
#
# Regenerate the committed schemas/ {id}.schema.json files from the Laravel
# fixture app in schemas/fixture using the real streams:schema command
# (streams/sdk). The committed files are this command's output — never hand
# written. Run `npm run types:sync` after this to rebuild entry types, or rely
# on CI (types.yml) to do both on every PR.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FIXTURE="$ROOT/schemas/fixture"
OUTPUT="$ROOT/schemas"

if [[ ! -f "$FIXTURE/.env" ]]; then
    cp "$FIXTURE/.env.example" "$FIXTURE/.env"
    (cd "$FIXTURE" && php artisan key:generate --force --no-interaction >/dev/null)
fi

if [[ ! -f "$FIXTURE/database/database.sqlite" ]]; then
    touch "$FIXTURE/database/database.sqlite"
fi

# streams:schema resolves --path relative to the fixture's working directory.
REL_OUTPUT="$(node -e 'const p=require("node:path");console.log(p.relative(process.argv[1], process.argv[2]))' "$FIXTURE" "$OUTPUT")"

(cd "$FIXTURE" && php artisan migrate --force --no-interaction >/dev/null)
(cd "$FIXTURE" && php artisan streams:schema --path="$REL_OUTPUT")
