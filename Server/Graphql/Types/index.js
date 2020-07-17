const fs = require('fs');
const path = require('path');

let scheme = ''
const basename = path.basename(__filename);

let l = fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
for (let index = 0; index < l.length; index++) {
    const element = l[index];
    const model = require(path.join(__dirname, element));
    scheme += model
}
scheme += require('./query')
scheme += require('./sub')
scheme += require('./mutators')
scheme += require('./enum')

console.log(scheme)
module.exports = scheme

