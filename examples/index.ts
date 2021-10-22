import { Streams } from '@laravel-streams/streams-api';

const streams = new Streams({
    url: 'localhost',
});


async function run(){
    const stream = await streams.make('clients')
    const clients = await stream.entries()
                                .where('age', '>', 5)
                                .where('age', '<', 50)
                                .orderBy('age', 'asc')
                                .get();
    for(const client of clients){
        client.email;
        client.age;
    }
}
