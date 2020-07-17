const db = require('../../../models');
var { pubsub, types } = require('../pubsub');

module.exports = {
    subscribe: () => pubsub.asyncIterator(types.TOPIC_UPDATE),
}