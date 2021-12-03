import { dirname, resolve,relative } from 'path';
import findUp from 'find-up';
import { copyFileSync, copySync, ensureDirSync } from 'fs-extra';
import { glob } from 'glob';
import { constants, existsSync } from 'fs';
import ask from '@radic/console-input';

const root  = (...parts) => resolve(__dirname, '../..',...parts);
const paths = (() => {
    const paths                = {
        project: {
            root        : null,
            streams     : null,
            composerJson: null,
        },
        package: {
            root    : root(),
            fixtures: {
                root   : root('test/fixtures'),
                streams: root('test/fixtures/streams'),
            },
        },
    };
    paths.project.composerJson = findUp.sync('composer.json', { cwd: root('..'), type: 'file' });
    paths.project.root         = dirname(paths.project.composerJson);
    paths.project.streams      = resolve(paths.project.root, 'streams');
    return paths;
})();

export async function copyStreamFiles() {
    const files            = glob.sync(resolve(paths.package.fixtures.streams, '**'),{nodir:true});
    let overwrite: boolean = false;
    for ( const file of files ) {
        const relativeFile = file.replace(paths.package.fixtures.streams + '/', '')
        const sourcePath = file;
        const destPath   = resolve(paths.project.streams, relativeFile);
        if ( !overwrite && existsSync(destPath) ) {
            let answer = await ask.list(`File "${destPath}" already consists. Should i overwrite it?`, [ 'no', 'yes', 'always' ], 'no');
            if ( answer === 'always' ) {
                overwrite = true;
            }
            if ( answer === 'no' ) continue;

        }
        ensureDirSync(dirname(destPath));
        copyFileSync(sourcePath, destPath);
        console.log(`[${file}] copied > "${destPath}"`)
    }
}

copyStreamFiles();
