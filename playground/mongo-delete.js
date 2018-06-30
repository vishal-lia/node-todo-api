const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Connected to MongoDB Server');

    const db = client.db('TodoApp');
    let collection = db.collection('Todos');

    // deleteMany
    collection.deleteMany({text: 'Pay Rent'}).then(result => {
        console.log(result);
    });

    // deleteOne
    collection.deleteOne({text: 'Pay Rent'}).then(result => {
        console.log(result);
    });

    // findOneAndDelete
    collection.findOneAndDelete({completed: false}).then(result => {
        console.log(result);
    });

    collection = db.collection('Users');

    collection.deleteMany({name: 'Kunnu'}).then(result => {
        console.log(result);
    });

    collection.findOneAndDelete({_id: new ObjectID('5b2f3a729fd1b213f234ee18')}).then(result => {
        console.log(result);
    });
});