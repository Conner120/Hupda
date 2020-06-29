var express = require('express')
var router = express.Router()
const passport = require('passport');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
var azure = require('azure-storage');
require('../config/passport.js')(passport);
const { user, profile, postMedia, comment, post, reaction } = require('../models');
var blobService = azure.createBlobService('scouthub', 'Xwf+aWpa4rAz9hrbGkJMMUo3tGXFqNJYg/Up05Uz3M180GwAvepo3QqfMmzEnIGwpZLVlvN8FnhyjurH5HnJdg==');
const { v4 } = require('uuid');
var omit = require('lodash.omit');

// const redis = require('redis');
const { Op } = require("sequelize");

// const cache = redis.createClient(32771, 'localhost');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.send(await req.user.getProfile())
})
router.get('/wPosts', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let requestedProfile = await req.user.getProfile({
        include: [{
            model: post, where: {
                root: true
            }, limit: 15, order: [['createdAt', 'DESC']]
        }]
    })
    switch (requestedProfile.alc) {
        case 0:
            if (requestedProfile.userId === req.user.id) {

                let uri = blobService.getUrl("profilemedia", `${requestedProfile.id}.png`);
                requestedProfile.profilepicuri = uri
            } else {
            }
            break;
        case 1:
            const friends = (await (requestedProfile.poster).getFriends())
            if (friends.some(x => x.id === req.user.id) || requestedProfile.userId === req.user.id) {
                let uri = blobService.getUrl("profilemedia", `${requestedProfile.id}.png`);
                requestedProfile.profilepicuri = uri
            } else {
            }
            break;
        case 2:
            let friendsoffriends = (await (requestedProfile.poster).getFriends())
            let fri = [...friendsoffriends];
            await asyncForEach(friendsoffriends, async (x) => {
                let t = await x.getFriends()
                fri.push(t)
            });
            fri = fri.flat()
            if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {
                let uri = blobService.getUrl("profilemedia", `${requestedProfile.id}.png`);
                requestedProfile.profilepicuri = uri
            } else {
            }
            break;
        case 3:
            break;
        case 4:
            let uri = blobService.getUrl("profilemedia", `${requestedProfile.id}.png`);
            requestedProfile.profilepicuri = uri

            break;
    }
    res.send(requestedProfile)
})
router.get('/friends', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let friends = await (await req.user.getProfile()).getFriends()
    friends.forEach(element => {
        element.dataValues['friend_friend'] = undefined
        element.dataValues['email'] = undefined
        element.dataValues['DOB'] = undefined
        element.dataValues['phone'] = undefined
        element.dataValues['createdAt'] = undefined
        element.dataValues['updatedAt'] = undefined
        element.dataValues['settings'] = undefined
        element.dataValues['userId'] = undefined
        element.dataValues['user_id'] = undefined

    });
    res.send(friends)
})
module.exports = router