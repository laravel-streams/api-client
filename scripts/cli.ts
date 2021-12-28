import yargs, { Arguments } from 'yargs';
import { isAbsolute, resolve } from 'path';
import { Analyze } from './analyze';
import { existsSync } from 'fs';
import { Doc, Docs } from './docs';


const root     = (...parts) => resolve(__dirname, '..', ...parts);
const analyzer = new Analyze();
const docs     = new Docs();

yargs
.scriptName('cli')
.help('h').alias('h', 'help')
.demandCommand()
.showHelpOnFail(true)
.command('analyze [outputDir]', 'Analyzes filesizes of the bundle and export the results', {
    builder: yargs => {
        yargs.positional('outputDir', {
            default    : root('docs'),
            description: 'The directory to put the generated files',
        });
        return yargs;
    },
    handler: (args: Arguments<{ outputDir: string, json?: string, markdown?: string, _: { outputDir: string } }>) => {
        const outputDir = isAbsolute(args.outputDir) ? args.outputDir : resolve(process.cwd(), args.outputDir);
        const analysis  = analyzer.create();
        analyzer.writeToJsonFile(resolve(outputDir, 'analysis.json'), analysis);
        console.log(`Analysis written to json file: ${resolve(outputDir, 'analysis.json')}`);
        analyzer.writeToMarkdownFile(resolve(outputDir, 'filesize.md'), analysis);
        console.log(`Analysis written to markdown file: ${resolve(outputDir, 'filesize.md')}`);
    },
})
.command('docs', 'Converts all markdown documents to html', {
    builder: yargs => {
        return yargs;
    },
    handler: (args) => {

        docs.add(root('docs/index.md'), root('docs/index.html'));
        docs.add(root('LICENSE.md'), root('docs/license.html'));
        if ( existsSync(root('docs/filesize.md')) ) {
            docs.add(root('docs/filesize.md'), root('docs/filesize.html'));
        }
        docs.on('converted', (doc: Doc, htmlContent: string) => {
            console.log(`Converted (markdown) [${doc.sourceFile}] to (html) [${doc.destFile}] `);
        });
        docs.convert();
    },
})
.parse();
