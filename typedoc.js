
const config = {
    entryPoints: ['./src/index.ts'],
    exclude    : 'test/**/*.ts',
    out        : './docs',
    tsconfig   : './tsconfig.typedoc.json',
    theme      : 'default',
    //https://marked.js.org/using_advanced#options
    markedOptions : {
        'mangle': false
    },
    plugin        : [
        // 'typedoc-plugin-custom-tags',
        // 'typedoc-plugin-external-module-name',
        'typedoc-plugin-extras',
        // 'typedoc-plugin-inline-sources',
        //'typedoc-plugin-markdown',
        'typedoc-plugin-merge-modules',
        // 'typedoc-plugin-mermaid',
    ],
    hideGenerator : true,
    readme        : '/README.md',
    includeVersion: true,
    name          : 'Streams Platform Client Api',
};

if(process.env.STREAMS_API_MD_DOCS){
    config.plugin.push('typedoc-plugin-markdown');
    config.out = './docs/api'
}


module.exports = config;
