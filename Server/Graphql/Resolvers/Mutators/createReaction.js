var { pubsub, types } = require('../pubsub');
const db = require('../../../models');
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
module.exports = async (root, args, { req }, info) => {
    const profile = await decodedToken(req);
    return (await db.reaction.create({
        ...args,
        profileId: profile.id
    }))
}