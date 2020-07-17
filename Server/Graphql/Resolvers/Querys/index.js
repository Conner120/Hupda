const fs = require('fs');
const path = require('path');

let scheme = {}
const basename = path.basename(__filename);

let l = fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
console.log(l)
for (let index = 0; index < l.length; index++) {
    const element = l[index];
    console.log(element)
    scheme[element.toString().split('.')[0]] = require(path.join(__dirname, element));
}
console.log(scheme)
module.exports = scheme

