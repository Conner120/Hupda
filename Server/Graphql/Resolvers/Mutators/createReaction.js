var { pubsub, types } = require('../pubsub');
const { getProfilePicture, isAuthorizedFor, getALCString } = require('../../../Helper')
const redis = require('redis');
const Post = require('../Querys/Post');
const RedisGraph = require("redisgraph.js").Graph;
let PostMeta = new RedisGraph("PostMeta", 'localhost', 6379);
module.exports = async (root, args, { req, db, profile }, info) => {
    let current = await PostMeta.query(`MATCH (a {id:'${args.postId}'}) return a`)
    if (current._resultsCount > 0) {
        current = current.next().get('a')
        await PostMeta.query(`MATCH (n {id:'${args.postId}'}) set n.${args.type} = '${parseInt(current.properties[args.type] | 0) + 1}'`);
    } else {
        await PostMeta.query(`CREATE(: reactionMeta{ id: $id, love: $love, like: $like, dislike:$dislike,thanks:$thanks,goodjob: $goodjob })`, {
            id: '427b8f9b-7bf4-47c8-ada8-4083ec4d31d7',
            love: (args.type === 'love') | 0, like: (args.type === 'like') | 0,
            dislike: (args.type === 'dislike') | 0, thanks: (args.type === 'thanks') | 0,
            goodjob: (args.type === 'good job') | 0
        });
    }
    if (args.type === 'goodjob') {
        args.type = 'good job'
    }
    return (await db.reaction.create({
        postId: args.postId,
        reactionType: args.type,
        profileId: profile.id
    }))
}