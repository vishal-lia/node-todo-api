const { mongoose } = require('../db/mongoose');
const { User} = require('../models/user');

User.remove({}).then(result => {
    console.log(result);
});

User.findOneAndRemove({email: "Sample3"}).then(user => {
    console.log(user);
});

User.findByIdAndRemove('5b38fccd84fd8560a1fcac8a').then(user => {
    console.log(user);
});
