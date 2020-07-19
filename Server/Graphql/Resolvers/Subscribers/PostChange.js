const db = require('../../../models');
var { pubsub, types } = require('../pubsub');
const { withFilter } = require('apollo-server');

module.exports = {
    subscribe: withFilter(
        () => pubsub.asyncIterator(types.POST_CHANGED),
        (payload, variables) => {
            console.log(payload)
            return payload.PostChange.id === variables.id;
        },
    ),
}