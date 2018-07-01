const { ObjectID } = require('mongodb');

const { mongoose } = require('../db/mongoose');
const { User} = require('../models/user');

let id = '5b379346ba251b260bf020e6';

if(!ObjectID.isValid(id)) {
    console.log('ID is invalid');
}

User.find({
    _id: id
}).then(users => {
    console.log('Users: ', users);
});

User.findOne({
    _id: id
}).then(user => {
    console.log('User: ', user);
});

User.findById(id).then(user => {
    if(!user) {
        return console.log('ID not found');
    }
    console.log('User: ', user);
}).catch(err => {
    console.log(err);
});