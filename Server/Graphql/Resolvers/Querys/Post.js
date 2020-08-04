const { decodedToken } = require('../../../Helper')
const { getProfilePicture, isAuthorizedFor, getALCString } = require('../../../Helper')
const redis = require('redis');
const Post = require('../Querys/Post');
const RedisGraph = require("redisgraph.js").Graph;
let PostMeta = new RedisGraph("PostMeta", '10.0.0.112', 6379);
module.exports = async (root, args, { req, db, profile }, info) => {
    if (profile) {
        const post = await db.post.findOne({ where: { id: args.id }, include: [{ model: db.profile, as: 'poster', attributes: ['first', 'last', 'userId', 'id', 'alc'] }] })
        if (await isAuthorizedFor(post.alc, post.poster, profile)) {
            if (!await isAuthorizedFor(post.poster.alc, post.poster, profile)) {
                const poster = post.poster;
                post.poster = {
                    first: poster.first,
                    last: poster.last.charAt(0),
                    id: poster.id
                }
            } else {
                post.poster.profilePicURI = getProfilePicture(post.poster.id)
            }
            let current = await PostMeta.query(`MATCH (a {id:'${args.id}'}) return a`)
            if (current._resultsCount > 0) {
                current = current.next().get('a')
                console.log(current)
                post.reactions = current.properties
            }
            console.log(post.poster.id)
            return post
        } else {
            throw new Error(`Invalid access to post must be a ${getALCString(post.alc)}`)
        }
    } else {
        throw new Error(`Invalid access to post must in error`)
    }
}