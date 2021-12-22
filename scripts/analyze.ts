import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import filesize from 'filesize';
import path, { dirname } from 'path';
import { Analysis, AnalyzeSnapshot, FileSizeOptions, SizeSnapshot } from './type';
import { objectify } from './utils';
import { Output } from '@radic/console-output';


const ensureDirSync = (...parts: string[]) => {
    let path = resolve(...parts);
    if ( !existsSync(path) ) {
        mkdirSync(path, { recursive: true });
    }
    return path;
};
const resolve       = (...parts) => path.join(...parts);

const fileSizeOptions: FileSizeOptions = {
    standard: 'jedec',
};

class Analyze {
    create(sizeSnapshotFilePath: string = resolve(__dirname, '../.size-snapshot.json')): Analysis {
        if ( !existsSync(sizeSnapshotFilePath) ) {
            throw new Error(`couldnot find size-snapshot file at ${sizeSnapshotFilePath}`);
        }
        const snapshotsContent                        = readFileSync(sizeSnapshotFilePath, 'utf8');
        const snapshots: Record<string, SizeSnapshot> = JSON.parse(snapshotsContent);
        const analysis: Analysis                      = Object.entries(snapshots).map(([ fileName, snapshot ]) => {
            const data: AnalyzeSnapshot = {
                bundled : filesize(snapshot.bundled, fileSizeOptions).toString(),
                minified: filesize(snapshot.minified, fileSizeOptions).toString(),
                gzipped : filesize(snapshot.gzipped, fileSizeOptions).toString(),
            };
            if ( snapshot?.treeshaked !== undefined ) {
                if ( snapshot?.treeshaked?.rollup !== undefined ) {
                    data.rollup            = filesize(snapshot?.treeshaked?.rollup.code).toString();
                    data.import_statements = snapshot?.treeshaked.rollup.import_statements;
                }
                if ( snapshot?.treeshaked?.webpack !== undefined ) {
                    data.webpack = filesize(snapshot?.treeshaked?.webpack.code).toString();
                }
            }
            return [ fileName, data ];
        }).reduce(objectify, {});
        return analysis;
    }

    writeToJsonFile(path: string, analysis?: Analysis) {
        if ( !analysis ) {
            analysis = this.create();
        }
        const content = JSON.stringify(analysis, null, 4);
        ensureDirSync(dirname(path));
        writeFileSync(path, content, 'utf8');
    }

    toTable(analysis?: Analysis) {
        if ( !analysis ) {
            analysis = this.create();
        }
        const tableHeaders = [ 'File', 'Bundled', 'Minified', 'Gziped', 'Rollup', 'Webpack', 'Import Statements' ];
        const tableRows    = [];
        Object.entries(analysis).forEach(([ fileName, snapshot ]) => {
            tableRows.push([ fileName, snapshot.bundled, snapshot.minified, snapshot.gzipped, snapshot.rollup, snapshot.webpack, snapshot.import_statements ]);
        });
        return { headers: tableHeaders, rows: tableRows };
    }

    convertToMarkdownTable(analysis?: Analysis) {
        if ( !analysis ) {
            analysis = this.create();
        }
        const lines        = [];
        const tableHeaders = [ 'File', 'Bundled', 'Minified', 'Gziped', 'Rollup', 'Webpack', 'Import Statements' ];
        const tableRows    = [];
        Object.entries(analysis).forEach(([ fileName, snapshot ]) => {
            tableRows.push([ fileName, snapshot.bundled, snapshot.minified, snapshot.gzipped, snapshot.rollup, snapshot.webpack, snapshot.import_statements ]);
        });
        lines.push(`| ${tableHeaders.join(' | ')} |`);
        lines.push(`| ${tableHeaders.map((v, i) => {
            if ( i === 0 ) {
                return ':--' + '-'.repeat(40);
            }
            return ':--' + '-'.repeat(v.length);
        }).join('|')} |`);
        for ( const row of tableRows ) {
            lines.push(`| ${row.join(' | ')} |`);
        }
        const result = lines.join('\n');
        return result;
    }
}

async function runCli() {
    let out = new Output();

    const analyze  = new Analyze();
    const analysis = analyze.create();
    if ( process.argv.includes('--renderJson') ) {
        const filePath = resolve(__dirname, '..', 'dist', 'analysis.json');
        analyze.writeToJsonFile(filePath, analysis);
        out.nl.line(`{bold}Analysis written to{/bold}: {teal}${filePath}{/teal}`);
    }
    if ( process.argv.includes('--renderMarkdown') ) {
        const result = analyze.convertToMarkdownTable(analysis);
        out.nl.nl.line(`{bold}Analysis converted to markdown table{/bold}:`);
        if(!printCliTable()){
            out.line(result);
        }
        const filePath = resolve(__dirname, '..', 'docs', 'filesize.md');
        writeFileSync(filePath, result, 'utf8');

        out.nl.nl.line(`{bold}Markdown written to{/bold}: {teal}${filePath}{/teal}`);
    }

    function printCliTable() {
        try {
            if ( require.resolve('cli-table3') ) {
                const { headers, rows } = analyze.toTable(analysis)
                const table             = new out.ui.Table({
                    head: headers
                })
                table.push(...rows);
                out.line(table.toString())
                return true;
            }
        }catch (e) {
        }
        return false
    }
    console.log('\n\ndone');
}

runCli();
