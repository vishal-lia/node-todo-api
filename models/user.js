const mongoose = require('mongoose');
const validator = require('validator');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//Instance methods
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = JWT.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.isValidPassword = function(password) {
    let user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
            if(res) {
                resolve(user);
            } else {
                reject();
            }
        });
    });
};

UserSchema.methods.removeToken = function(token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

//Model Methods
UserSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded = null;

    try {
        decoded = JWT.verify(token, 'abc123');
    } catch(err) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.access': decoded.access,
        'tokens.token': token
    });
};

//Mongoose Middleware
UserSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) { console.log('Error: ', err); }

            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) { console.log('Error: ', err); }

                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };