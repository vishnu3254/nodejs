const fs = require('fs');

console.log('start')
const readFileCallBack = (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
}
fs.readFile('./data.txt', 'utf-8', readFileCallBack);
console.log('data', data)
console.log('end');