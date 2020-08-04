const { decodedToken } = require('../../../Helper')
const { getProfilePicture, isAuthorizedFor, getALCString } = require('../../../Helper')
const redis = require('redis');
const Post = require('../Querys/Post');
const RedisGraph = require("redisgraph.js").Graph;
let PostMeta = new RedisGraph("PostMeta", '10.0.0.112', 6379);
module.exports = async (root, args, { req, db, profile }, info) => {
    if (profile) {
        const posts = await db.post.findOne({ where: { id: args.id }, include: [{ model: db.profile, as: 'poster', attributes: ['first', 'last', 'userId', 'id', 'alc'] }, { model: db.comment, limit: 10, offset: args.offset, as: 'comments', include: [{ model: db.post, as: 'commentPost', include: [{ model: db.profile, as: 'poster', attributes: ['first', 'last', 'userId', 'id', 'alc'] }] }] }] })
        await asyncForEach(posts.comments, async (cp, i) => {
            let post = cp.commentPost
            // if (await isAuthorizedFor(post.alc, post.poster, profile)) {
            if (!await isAuthorizedFor(post.poster.alc, post.poster, profile)) {
                const poster = post.poster;
                posts.comments[i].poster = {
                    first: poster.first,
                    last: poster.last.charAt(0),
                    id: poster.id
                }
            } else {
                posts.comments[i].commentPost.poster.profilePicURI = getProfilePicture(post.poster.id)
            }
            let current = await PostMeta.query(`MATCH (a {id:'${args.id}'}) return a`)
            if (current._resultsCount > 0) {
                current = current.next().get('a')
                post.reactions = current.properties
            }
            // } else {
            //     // throw new Error(`Invalid access to post must be a ${getALCString(post.alc)}`)
            // }
        })
        return posts.comments
    } else {
        // throw new Error(`Invalid access to post must be a ${getALCString(post.alc)}`)
    }
}
async function asyncForEach(array, callback) {
    await Promise.all(array.map(async (item, index) => {
        await callback(item, index, array);
    }))
}