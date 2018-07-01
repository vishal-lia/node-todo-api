const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://vishal_lia:vishal786@ds121960.mlab.com:21960/nodedb';
//const MONGODB_URI = 'mongodb://localhost:27017/TodoApp';

mongoose.connect(MONGODB_URI);

module.exports = { mongoose };