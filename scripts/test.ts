import { stringify } from 'qs';
import Axios from 'axios';


const params = [
        {
            'where': [
                'user',
                '==',
                '9c437308-170c-48f5-9d85-1614c54e29a6',
            ],
        },
        {
            'where': [
                'status',
                '==',
                'approved',
            ],
        },
    ];

function run() {
    const output = stringify(params, {
encode:false,
    });
    return output;
}

async function send(params){
    try {
        const url = 'http://dev2.local/tester?' + params;
        const response = await Axios.get(url);

        return response;
    }catch(e){
        throw new e;
    }
}

send(run());
