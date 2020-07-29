const redis = require('redis');
const RedisGraph = require("redisgraph.js").Graph;
let ActivityTrack = new RedisGraph("ActivityTrack", '10.0.0.112', 6379);
const subscriber = redis.createClient(6379, '10.0.0.112');
const publisher = redis.createClient(6379, '10.0.0.112');
let PostMeta = new RedisGraph("PostMeta", '10.0.0.112', 6379);
module.exports = { publisher, subscriber, ActivityTrack, PostMeta }