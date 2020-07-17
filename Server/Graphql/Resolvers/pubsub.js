let { RedisPubSub } = require('graphql-redis-subscriptions');
let { subscriber, publisher } = require('../../config/Redis')
const pubsub = new RedisPubSub({
    publisher,
    subscriber
});

const types = {
    POST_CHANGED: 'PostChanged',
    TOPIC_UPDATE: 'TopicUpdate'
}
module.exports = { pubsub, subscriber, types }