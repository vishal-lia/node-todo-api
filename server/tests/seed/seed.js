const { ObjectID } = require('mongodb');
const JWT = require('jsonwebtoken');

const { Todo } = require('../../../models/todo');
const { User } = require('../../../models/user');

let todos = [{
    _id: new ObjectID(),
    text: 'First Test Todo'
}, {
    _id: new ObjectID(),
    text: 'Second Test Todo',
    completed: true,
    completedAt: new Date().getTime()
}];

let userOneId = new ObjectID();
let userTwoId = new ObjectID();

let users = [{
    _id: userOneId,
    email: 'vishal@gmail.com',
    password: 'vishal123',
    tokens: [{
        access: 'auth',
        token: JWT.sign({_id: userOneId.toHexString(), access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'kunnu123@gmail.com',
    password: 'kunnu345'
}];

let populateTodos = done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done()).catch(err => done(err));
};

let populateUsers = done => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done()).catch(err => done(err));
}

module.exports = { todos, populateTodos, users, populateUsers }