const JWT = require('jsonwebtoken');

let data = {
    id: 10
}

let token = JWT.sign(data, 'yetanothersecret');
console.log(token);

let decoded = JWT.verify(token, 'yetanothersecret');
console.log('Decoded: ', decoded);

// const { SHA256 } = require('crypto-js');

// let message = 'I am message 5';
// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//     id: 4
// }

// let token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data) + 'my secret').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(data)).toString();

// let resultHash = SHA256(JSON.stringify(data) + 'my secret').toString();

// if(token.hash === resultHash) {
//     console.log('Data not changed');
// } else {
//     console.log('Alert! Security breach!!');
// }