import { Streams } from '../src';

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

    streams.hooks.createRequestConfig.tap('NAME', config => {
        // alter config
        return config;
    })
    streams.hooks.createRequest.tap('NAME', request => {
        // alter request
        return request;
    })
    streams.hooks.created.tap('NAME', stream => {
        // alter stream
        return stream;
    })

}
