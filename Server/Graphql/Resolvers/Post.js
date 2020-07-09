const db = require('../../models');
const { getProfilePicture, isAuthorizedForPost, getALCString } = require('../../Helper')

module.exports = async (args, req, t) => {
    const post = await db.post.findOne({ where: { id: args.id }, include: [{ model: db.profile, as: 'poster', attributes: ['first', 'last', 'userId', 'id'] }] })
    post.poster.profilePicURI = getProfilePicture(post.poster.id)
    if (await isAuthorizedForPost(post, req.user)) {
        return post
    } else {
        throw new Error(`Invalid access to post must be a ${getALCString(post.alc)}`)
    }
}