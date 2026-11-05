import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schemaDir = path.join(rootDir, 'schemas');
const generatedPath = path.join(rootDir, 'types', 'entries.generated.d.ts');
const script = path.join(rootDir, 'scripts', 'generate-types.mjs');

function runGenerator() {
    const outFile = path.join(tmp, 'entries.generated.d.ts');
    execFileSync(process.execPath, [script, schemaDir, outFile], { encoding: 'utf8' });
    return readFileSync(outFile, 'utf8');
}

const tmp = mkdtempSync(path.join(os.tmpdir(), 'api-client-types-'));

after(() => rmSync(tmp, { recursive: true, force: true }));

describe('scripts/generate-types.mjs', () => {
    it('turns committed streams:schema JSON into an entry interface per stream', () => {
        const schemaFiles = readdirSync(schemaDir).filter((name) => name.endsWith('.schema.json'));
        assert.ok(schemaFiles.length > 0, 'expected committed streams:schema output under schemas/');

        const contents = runGenerator();

        for (const file of schemaFiles) {
            const streamId = file.replace(/\.schema\.json$/, '');
            const interfaceName = streamId
                .split(/[-_]+/g)
                .filter(Boolean)
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join('') + 'Entry';
            assert.match(contents, new RegExp(`export interface ${interfaceName} `), `${file} -> ${interfaceName}`);
            assert.match(contents, new RegExp(`"${streamId}": ${interfaceName};`), `${file} in StreamEntryMap`);
        }
    });

    it('derives property types from the real schema, not hand-written fixtures', () => {
        const todos = JSON.parse(readFileSync(path.join(schemaDir, 'todos.schema.json'), 'utf8'));
        assert.equal(todos.properties.description.type, 'string');
        assert.equal(todos.properties.completed.type, 'boolean');

        const contents = runGenerator();
        assert.match(contents, /"description": string;/);
        assert.match(contents, /"completed"\?: boolean;/);
    });

    it('regenerates exactly the committed types (drift check)', () => {
        const generated = runGenerator();
        const committed = readFileSync(generatedPath, 'utf8');
        assert.equal(generated, committed);
    });
});
