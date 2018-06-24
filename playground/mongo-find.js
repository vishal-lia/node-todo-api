const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) {
        return console.log('Unable to connect to server');
    }
    console.log('Connected to MongoDB Server');

    const db  = client.db('TodoApp');
    let collection = db.collection('Todos');

    collection.find({
        _id: new ObjectID('5b2f69df0eee1793d7af080f')
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, null, 2));
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });

    collection.find().count().then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });

    collection = db.collection('Users');
    collection.find({
        name: 'Kunnu'
    }).count().then((count) => {
        console.log(`Number of Users: ${count}`);
    }, (err) => {
        console.log('Unable to fetch Users', err);
    });
});