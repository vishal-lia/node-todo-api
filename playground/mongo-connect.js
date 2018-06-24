const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB Server.');
    }

    console.log('Connected to MongoDB Server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to Insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, null, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Vishal',
    //     age: 23,
    //     location: 'Bangalore'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert to Users');
    //     }

    //     console.log(JSON.stringify(result.ops, null, 2));
    // });

    client.close();
});