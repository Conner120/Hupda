let express = require('express')
let path = require('path')
let app = express()
var atob = require('atob');
const Blob = require("cross-blob");
const imageDataURI = require('image-data-uri')
const axios = require('axios');
const { user, profile, postMedia, share, comment, post, reaction } = require('./models');
const passport = require('passport');
const { LoremIpsum } = require("lorem-ipsum");
var azure = require('azure-storage');
const blobUtil = require('blob-util')
const Sequelize = require('sequelize');
var blobService = azure.createBlobService('scouthub', 'Xwf+aWpa4rAz9hrbGkJMMUo3tGXFqNJYg/Up05Uz3M180GwAvepo3QqfMmzEnIGwpZLVlvN8FnhyjurH5HnJdg==');
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});
const textToImage = require('text-to-image');
const { fstat } = require('fs');

dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}
async function make(opost) {
    return new Promise(async (resolve, reject) => {

        let alc = Math.floor(Math.random() * 5)
        if (alc === 3) {
            alc = 4;
        }
        let profileNumber = Math.floor(Math.random() * 4);
        let profileId = '17eeea08-6ea6-44dc-842b-7b3b7ef43217'
        switch (profileNumber) {
            case 1:
                profileId = '75758c9e-3c1e-4a16-828e-6417bfee2034'
                break;
            case 2:
                profileId = 'e023fb2a-47dc-4ce8-960f-0d5dee2dd3be'
                break;
            case 3:
                profileId = '252ebf0c-1bda-471e-a687-9d7fbfb4d99b'
                break;
            default:
                break;
        }
        let createdPost = await post.create({
            title: lorem.generateWords(Math.ceil(Math.random() * 4) + 3),
            content: lorem.generateParagraphs(Math.ceil(Math.random() * 32)),
            profileId,
            alc,
        })
        let dataUri = await textToImage.generate(lorem.generateWords(3)).then(async (dataUri) => {
            return new Promise((resolve, reject) => {
                resolve(dataUri)
            })
        })

        var startDate = new Date();
        var expiryDate = new Date(startDate);
        expiryDate.setMinutes(startDate.getMinutes() + 120);
        startDate.setMinutes(startDate.getMinutes() - 1);
        var sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
                Start: startDate,
                Expiry: expiryDate
            }
        };
        let x = await postMedia.create({ type: 'png', description: lorem.generateSentences(2), acl: Math.floor(Math.random() * 5), profileId, postId: createdPost.id })
        // let token = blobService.generateSharedAccessSignature("postmedia", `${x.id}.${x.filetype}`, sharedAccessPolicy);
        // let uri = blobService.getUrl("postmedia", `${x.id}.${x.filetype}`, token);
        // var currentdate = new Date();
        // let file = dataURItoBlob(dataUri);
        // var Curr_date = currentdate.getDay + '-' + currentdate.getMonth + '-' + currentdate.getFullYear;
        await name(x, dataUri);
        // axios.put(uri, file, {
        //     headers: {
        //         "Access-Control-Allow-Origin": "*",
        //         'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        //         "Access-Control-Allow-Headers": "Origin, Content-Type, x-ms-*",
        //         "Content-Type": "image/png",
        //         "Content-Length": file.length, //here I am trying to get the size of image.
        //         "x-ms-date": Curr_date,
        //         "x-ms-blob-type": "BlockBlob",
        //     }
        // })
        //     .then(response => { console.log(response); console.log('correct!!'); })
        //     .catch(error => { console.log(error); console.log('error here!!'); });
        await comment.create({
            postId: opost,
            commentId: createdPost.id
        })
        resolve()
    })
}
function name(x, dataUri) {
    return new Promise((resolve, reject) => {
        imageDataURI.outputFile(dataUri, `${__dirname}/post_images/${x.id}.png`).then(() => {
            blobService.createBlockBlobFromLocalFile('postmedia', `${x.id}.png`, `${__dirname}/post_images/${x.id}.png`, async (error, result, response) => { console.log(error); console.log(result); console.log(response); resolve() })
        })
    })

}
async function runALot(x) {
    for (let index = 0; index < x; index++) {
        await make('2b129df2-d769-4a4c-8043-c363348848f6')
        console.log('test')
    };
}
runALot(100000)