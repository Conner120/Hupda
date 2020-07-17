const redis = require('redis');
const RedisGraph = require("redisgraph.js").Graph;
let ActivityTrack = new RedisGraph("ActivityTrack", 'localhost', 6379);
const subscriber = redis.createClient(6379, 'localhost');
const publisher = redis.createClient(6379, 'localhost');
module.exports = { publisher, subscriber, ActivityTrack }