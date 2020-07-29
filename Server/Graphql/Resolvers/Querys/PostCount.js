const db = require('../../../models');
module.exports = async (root, args, { req, db, profile }, info) => {
    if (!args.Profile) {
        return ({
            posts: await profile.countPosts(),
            shares: await profile.countShares()
        })
    } else {
        return ({
            posts: await db.post.count({ where: { profileId: args.Profile } }),
            shares: await db.share.count({ where: { profileId: args.Profile } })
        })
    }
}