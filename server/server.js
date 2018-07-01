const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('../db/mongoose');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');

const app = express();
const port = process.env.PORT | 3000;

app.use(bodyParser.json());

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

        res.status(200).send({todo});
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

app.listen(port, () => {
    console.log('Server running on port ', port);
});

module.exports = { app }