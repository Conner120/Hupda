const { decodedToken } = require('../../../Helper')
const { getProfilePicture, isAuthorizedFor, getALCString } = require('../../../Helper')
var azure = require('azure-storage');
var blobService = azure.createBlobService('scouthub', 'Xwf+aWpa4rAz9hrbGkJMMUo3tGXFqNJYg/Up05Uz3M180GwAvepo3QqfMmzEnIGwpZLVlvN8FnhyjurH5HnJdg==');
var startDate = new Date();
var expiryDate = new Date(startDate);
expiryDate.setHours(0, 0, 0, 0);
startDate.setHours(23, 59, 59, 999)
var sharedAccessPolicy = {
    AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Start: startDate,
        Expiry: expiryDate
    }
};
const redis = require('redis');
const Post = require('../Querys/Post');
const RedisGraph = require("redisgraph.js").Graph;
let PostMeta = new RedisGraph("PostMeta", 'localhost', 6379);
module.exports = async (root, args, { req, db, profile }, info) => {
    const post = await db.post.findOne({ where: { id: args.id }, include: [{ model: db.profile, as: 'poster', attributes: ['first', 'last', 'userId', 'id', 'alc'] }] })
    post.poster.profilePicURI = getProfilePicture(post.poster.id)
    if (await isAuthorizedFor(post.alc, post.poster, profile)) {
        if (!await isAuthorizedFor(post.poster.alc, post.poster, profile)) {
            const poster = post.poster;
            post.poster = {
                first: poster.first,
                last: poster.last.charAt(0)
            }
        } else {
            let token = blobService.generateSharedAccessSignature("profilemedia", `${post.poster.id}_current.png`, sharedAccessPolicy);
            post.poster.dataValues.profilePicURI = blobService.getUrl("profilemedia", `${post.poster.id}_current.png`, token);
        }
        let current = await PostMeta.query(`MATCH (a {id:'${args.id}'}) return a`)
        if (current._resultsCount > 0) {
            current = current.next().get('a')
            console.log(current)
            post.reactions = current.properties
        }
        return post
    } else {
        throw new Error(`Invalid access to post must be a ${getALCString(post.alc)}`)
    }
}