const fs = require('fs');

console.log('start')
const data = fs.readFileSync('./data.txt', 'utf8');
console.log(data)
console.log('end')