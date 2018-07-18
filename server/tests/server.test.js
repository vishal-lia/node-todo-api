const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

let { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

//TODOS
describe('POST /todos', () => {
    it('should create a new todo', done => {
        let text = 'Test Todo text';

        request(app)
            .post('/todos')
            .send({text})
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            });
    });

    it('should not create todo with invalid body data', done => {
        let text = "";

        request(app)
            .post('/todos')
            .send(text)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not return todo doc of other user', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if ID not found', done => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ID\'s', done => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove todo', done => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId).then(todo => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch(err => done(err));
            });
    });

    it('should not remove todo of other user', done => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.findById(hexId).then(todo => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch(err => done(err));
            });
    });

    it('should return 404 if ID not found', done => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ID\'s', done => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', done => {
        let hexId = todos[0]._id.toHexString();
        let text = "Changed the task";
        
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                "text": text,
                "completed": true
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeTruthy();
                expect(typeof res.body.todo.completedAt).toBe('number');                
            })
            .end(done);
    });

    it('should not update the todo of other user', done => {
        let hexId = todos[0]._id.toHexString();
        let text = "Changed the task";
        
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                "text": text,
                "completed": true
            })
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when todo is not completed', done => {
        let hexId = todos[1]._id.toHexString();
        let text = "Task yet to complete";

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                "text": text,
                "completed": false
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBeFalsy();              
            })
            .end(done);
    });
});

//USERS
describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .send()
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', done => {
        let email = 'testmail@gmail.com';
        let password = 'test$123';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if(err) {
                    return done(err);
                }

                User.findOne({email}).then(user => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch(err => done(err));
            })
    });

    it('should return validation errors if request is invalid', done => {
        let email = 'testmail2@gmail.com';
        let password = 'test';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
    
    it('should not create user if email is in use', done => {
        let email = 'vishal@gmail.com';
        let password = 'test123+';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and create auth token', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch(err => done(err));
            });
    });

    it('should reject invalid login', done => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 'abc'
            })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then(user => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch(err => done(err));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', done => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[0]._id).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(err => done(err));
            });
    });
});