var vfile = require('to-vfile')
var retext = require('retext')
var pos = require('retext-pos')
var keywords = require('retext-keywords')
var toString = require('nlcst-to-string')

retext()
    .use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
    .use(keywords, { maximum: 2 })
    .process(vfile.readSync('example.txt'), done)

function done(err, file) {
    if (err) throw err

    console.log('Key-phrases:')
    file.data.keyphrases.forEach(function (phrase) {
        console.log(phrase.matches[0].nodes.map(stringify).join(''))
        function stringify(value) {
            return toString(value)
        }
    })
}