const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    const db = client.db('TodoApp');
    let collection = db.collection('Todos');

    // findOneAndUpdate
    collection.findOneAndUpdate({
        _id: new ObjectID('5b2fa81d5f40c3cdf08f1989')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then(result => {
        console.log(result);
    });

    collection = db.collection('Users');

    collection.findOneAndUpdate({
        _id: new ObjectID('5b2e702ccefdc31c9b0cbed2')
    }, {
        $set: {
            name: 'Kunnu'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then(result => {
        console.log(result);
    });
});