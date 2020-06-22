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