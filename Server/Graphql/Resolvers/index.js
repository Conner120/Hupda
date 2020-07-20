const Query = require('./Querys')
const Mutation = require('./Mutators')
// var Subscription = require('./Subscribers');
var { pubsub, types } = require('./pubsub');
module.exports = {
    Query,
    // Subscription,
    Mutation
}
