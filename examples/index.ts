import { Streams } from '@laravel-streams/streams-api';

const streams = new Streams({
    baseURL: 'https://localhost/api',
});


async function run(){
    const stream = await streams.make('clients')
    const clients = await stream.getEntries()
                                .where('age', '>', 5)
                                .where('age', '<', 50)
                                .orderBy('age', 'asc')
                                .get();
    for(const client of clients){
        client.email;
        client.age;
    }
}

async function extend(){
    streams.client.hooks.createRequest.tap('NAME', factory => {
        factory.headers({

        }).mode('cors').bearer('token')
        return factory;
    })
    streams.client.hooks.request.tap('NAME', request => {

        return request;
    })
    streams.client.hooks.response.tap('NAME', (response,request) => {
        if(response.headers.has('Content-Type')){
            const contentType = response.headers.get('Content-Type')
            if(contentType === 'application/json'){
                response.json()
            }
        }
        return response;
    })
}
