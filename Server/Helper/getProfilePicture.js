var azure = require('azure-storage');
var blobService = azure.createBlobService('scouthub', 'Xwf+aWpa4rAz9hrbGkJMMUo3tGXFqNJYg/Up05Uz3M180GwAvepo3QqfMmzEnIGwpZLVlvN8FnhyjurH5HnJdg==');

module.exports = function (profileId) {
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
    var token = blobService.generateSharedAccessSignature("profilemedia", `${profileId}_current.png`, sharedAccessPolicy);
    return blobService.getUrl("profilemedia", `${profileId}_current.png`, token);
}