require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const mongoose = require('../db/mongoose');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { authenticate } = require('../middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


// TODOS
app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({todos});
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findById(id).then(todo => {
        if(!todo) {
            res.status(404).send();
        }

        res.send({todo});
    }).catch(err => {
        res.status(400).send();
    });
});

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then(todo => {
        if(!todo) {
            res.status(404).send();
        }

        res.send({todo});
    }).catch(err => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
        if(!todo) {
            res.status(404).send();
        }

        res.send({todo});
    }).catch(err => {
        res.status(400).send();
    });
});

// USERS
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    let {email, password} = req.body;

    User.findOne({email}).then(user => {
        if(!user) {
            res.status(404).send();
        }

        return user.isValidPassword(password);
    }).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        })
    }).catch(err => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log('Server running on port ', port);
});

module.exports = { app }