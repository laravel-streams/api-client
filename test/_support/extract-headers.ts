import { JSDOM } from 'jsdom';
import { readFileSync, writeFileSync } from 'fs';
import JQuery from 'jquery';
import { TypeDefinitionBuilder } from '@radic/core';
import { snakeCase } from 'lodash';
import { objectify } from './generator';

let html              = readFileSync(__dirname + '/headers.html', 'utf8');
const dom             = new JSDOM(html);
// @ts-ignore
const $: JQueryStatic = JQuery(dom.window);

interface HeaderNameDefinition {
    name: string, key: string, position: number
}
interface HeaderDefinition {
    type:string,
    title:string,
    headerNames:HeaderNameDefinition[],
    rows: string[][];
}
const headerDefinitions:HeaderDefinition[] = [];
let $tables   = $('table'); // as any as HTMLTableElement[]
$tables.each((i, el) => {
    const $table    = $(el);
    const type      = $table.attr('id');
    const title     = $table.attr('about');
    let headerNames: HeaderNameDefinition[]
    let rows: any[] = [];
    const $rows     = $table.find('tr');
    $rows.each((i, el) => {
        const $row = $(el);
        if ( i === 0 ) {
            const $headers = $row.find('th');
            headerNames    = $headers.map((i, el) => {
                let name = $(el).text().trim().replace(/\n/g, '');
                let key  = snakeCase(name);
                return { name, key, position: i };
            }).toArray();
            return;
        }
        const $columns = $row.find('td');
        const columns  = $columns.map((i, el) => {
           return $(el).text().trim().replace(/\n/g, '').replace(/\[\d*?\]/,'');
        }).toArray();

        rows.push(columns);
    });
    headerDefinitions.push({
        type,
        title,
        headerNames,
        rows,
    });
});

const nameMap = {
    request_standard: 'StandardRequestHeaders',
    request_non_standard: 'NonStandardRequestHeaders',
    response_standard: 'StandardResponseHeaders',
    response_non_standard: 'NonStandardResponseHeaders',

}
const namespace = 'headers'

const b = new TypeDefinitionBuilder()
b.export.type('ResponseHeaderValue', 'string')
b.export.type('RequestHeaderValue', 'string')
b.export.type('HeaderValue', 'string')
headerDefinitions.forEach(definition => {
    let value = definition.type.startsWith('request') ? 'RequestHeaderValue':'ResponseHeaderValue'
    let bi = b.export.open('interface', nameMap[definition.type])
    let rows= definition.rows.map((row, irow)=>{
        let r:any = {        }
        row.forEach((col, icol) => {
            let headerName = definition.headerNames[icol];
            r[headerName.key] = col.trim().replace(/\n/g, '');
        })
        return r;
    })
    let map : Record<string, number> = definition.headerNames.map((v) => {
        return [v.key, v.position]
    }).reduce(objectify,{});
    for(const row of rows){
        let docblock = [];
        if(row.description) docblock.push(row.description,'')
        if(row.example) docblock.push('@example',row.example)
        bi.docblock(docblock.join("\n"))
        bi.add("'"+row[definition.headerNames[0].key]+"'",value)
    }
    bi.close()
})

b.export.type('RequestHeaders', `${nameMap.request_standard}|${nameMap.request_non_standard}`)
b.export.type('ResponseHeaders', `${nameMap.response_standard}|${nameMap.response_non_standard}`)
b.export.type('RequestHeader', `keyof ${nameMap.request_standard}| keyof ${nameMap.request_non_standard}`)
b.export.type('ResponseHeader', `keyof ${nameMap.response_standard}| keyof ${nameMap.response_non_standard}`)
b.export.type('Headers', `StandardRequestHeaders | NonStandardRequestHeaders | StandardResponseHeaders | NonStandardResponseHeaders`)
b.export.type('Header', `keyof StandardRequestHeaders | keyof NonStandardRequestHeaders | keyof StandardResponseHeaders | keyof NonStandardResponseHeaders |string`)

let result = b.build();
writeFileSync(__dirname+'/header-types.ts',result, 'utf8');
