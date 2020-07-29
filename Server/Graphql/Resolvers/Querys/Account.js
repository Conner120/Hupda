const db = require('../../../models');
const { decodedToken, getProfilePicture } = require('../../../Helper')
module.exports = async (root, args, { req, db, profile }, info) => {
    profile.profilePicURI = getProfilePicture(profile.id)
    if (profile) {
        console.log(profile)
        return profile
    } else {
        return {}
    }
}