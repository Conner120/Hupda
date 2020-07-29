var azure = require('azure-storage');
var blobService = azure.createBlobService('scouthub', 'kw0xZ/B30Yd7vyFKLTgo1cqnSlOYjPW8jQZ28shv37lY2APVpRYptTW5Gugmx1njN6WXabPSZseqTw3mQ9Pt2A==');

module.exports = function (profileId) {
    var startDate = new Date();
    var expiryDate = new Date(startDate);
    startDate.setHours(0, 0, 0, 0);
    expiryDate.setHours(23, 59, 59, 999)
    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
            Start: startDate,
            Expiry: expiryDate
        }
    };
    var token = blobService.generateSharedAccessSignature("profilemedia", `${profileId}.png`, sharedAccessPolicy);
    return blobService.getUrl("profilemedia", `${profileId}.png`, token);
}