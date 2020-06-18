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
const redis = require('redis');
const { Op } = require("sequelize");

const cache = redis.createClient(32771, 'localhost');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const requestedPost = await post.findOne({ where: { id: req.query.id }, include: [{ model: comment, as: 'comments', include: [{ model: post, as: 'comment' }] }, { model: profile, as: 'poster' }] })
    requestedPost.dataValues.reactionsMeta = await reactionCount(req.query.id)
    if (requestedPost) {
        const pid = (await req.user.getProfile()).id
        var startDate = new Date();
        var expiryDate = new Date(startDate);
        expiryDate.setMinutes(startDate.getMinutes() + 120);
        startDate.setMinutes(startDate.getMinutes() - 1);
        var sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                Start: startDate,
                Expiry: expiryDate
            }
        };
        let media = []
        if (requestedPost.media) {
            await asyncForEach(requestedPost.media, async (x) => {
                let token = blobService.generateSharedAccessSignature("postmedia", `${x.id}.${x.filetype}`, sharedAccessPolicy);
                let uri = blobService.getUrl("postmedia", `${x.id}.${x.filetype}`, token);
                media.push(x.dataValues)
                media[media.length - 1].uri = uri
            })
        }
        switch (requestedPost.dataValues.alc) {
            case 0:
                if (requestedPost.poster.userId === req.user.id) {
                    res.send(requestedPost)
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 1:
                const friends = (await (requestedPost.poster).getFriends())
                if (friends.some(x => x.id === req.user.id) || requestedPost.poster.userId === req.user.id) {
                    let fids = friends.map(x => x.id);
                    requestedPost.dataValues.reaction = await reaction.findAll({
                        where: {
                            postId: req.query.id,
                            profileId: {
                                [Op.or]: fids,
                                [Op.or]: pid
                            }
                        }
                    })
                    console.log(await reaction.findAll({
                        where: {
                            postId: req.query.id,
                            profileId: {
                                [Op.or]: fids,
                                [Op.or]: pid
                            }
                        }
                    }))
                    res.send(requestedPost)
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 2:
                let friendsoffriends = (await (requestedPost.poster).getFriends())
                let fri = [...friendsoffriends];
                await asyncForEach(friendsoffriends, async (x) => {
                    let t = await x.getFriends()
                    fri.push(t)
                });
                fri = fri.flat()
                if (fri.some(x => x.userId === req.user.id) || requestedPost.poster.userId === req.user.id) {
                    let fids = fri.map(x => x.id);
                    console.log(fids)
                    requestedPost.dataValues.reaction = await reaction.findAll({
                        where: {
                            postId: req.query.id,
                            profileId: {
                                [Sequelize.Op.in]: fids
                            },
                        }
                    })
                    res.send(requestedPost)
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 3:
                res.send(200, 'yet to be implemented')
                break;
            case 4:
                res.send(requestedPost)
                break;
        }
    } else {
        res.send(404, 'not found')
    }

})
// define the about route
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let media = []
    let pid = (await req.user.getProfile()).id
    let postId = v4()
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
    console.log(media)
    let createdPost = await post.create({
        id: postId,
        title: req.body.title,
        content: req.body.content,
        profileId: pid,
        alc: req.body.alc,
    })
    await asyncForEach(req.body.media, async (x) => {
        x.id = v4();
        let token = blobService.generateSharedAccessSignature("postmedia", `${x.id}.${x.filetype}`, sharedAccessPolicy);
        let uri = blobService.getUrl("postmedia", `${x.id}.${x.filetype}`, token);
        media.push({ id: x.id, uri, description: x.description, acl: req.body.acl, profileId: pid, postId })
        await postMedia.create({ id: x.id, type: x.filetype, description: x.description, acl: req.body.acl, profileId: pid, postId })
    })
    createdPost.dataValues.media = media;
    console.log(createdPost)
    res.send(createdPost)
})
router.post('/reaction', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const requestedPost = await post.findOne({ where: { id: req.body.id }, include: [{ model: profile, as: 'poster' }] })
    if (requestedPost) {
        switch (requestedPost.dataValues.alc) {
            case 0:
                if (requestedPost.poster.userId === req.user.id) {
                    res.send(await reaction.create({
                        profileId: (await req.user.getProfile()).id,
                        reactionType: req.body.type,
                        postId: requestedPost.id
                    }))
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 1:
                const friends = (await (requestedPost.poster).getFriends())
                if (friends.some(x => x.id === req.user.id) || requestedPost.poster.userId === req.user.id) {
                    res.send(await reaction.create({
                        profileId: (await req.user.getProfile()).id,
                        reactionType: req.body.type,
                        postId: requestedPost.id
                    }))
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 2:
                let friendsoffriends = (await (requestedPost.poster).getFriends())
                let fri = [...friendsoffriends];
                await asyncForEach(friendsoffriends, async (x) => {
                    let t = await x.getFriends()
                    fri.push(t)
                });
                fri = fri.flat()
                if (fri.some(x => x.userId === req.user.id) || requestedPost.poster.userId === req.user.id) {
                    res.send(await reaction.create({
                        profileId: (await req.user.getProfile()).id,
                        reactionType: req.body.type,
                        postId: requestedPost.id
                    }))
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 3:
                res.send(200, 'yet to be implemented')
                break;
            case 4:
                res.send(await reaction.create({
                    profileId: (await req.user.getProfile()).id,
                    reactionType: req.body.type,
                    postId: requestedPost.id
                }))
                break;
        }
    } else {
        res.send(404, 'not found')
    }
})
router.post('/comment', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const requestedPost = await post.findOne({ where: { id: req.body.id }, include: [{ model: profile, as: 'poster' }] })
    if (requestedPost) {
        let pid = (await req.user.getProfile()).id
        switch (requestedPost.dataValues.alc) {
            case 0:
                if (requestedPost.poster.userId === req.user.id) {
                    let createdPost = await post.create({
                        title: req.body.title,
                        content: req.body.content,
                        profileId: pid,
                        alc: req.body.alc,
                    })
                    res.send(await comment.create({
                        postId: req.body.id,
                        commentId: createdPost.id
                    }))
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 1:
                const friends = (await (requestedPost.poster).getFriends())
                if (friends.some(x => x.id === req.user.id) || requestedPost.poster.userId === req.user.id) {
                    let createdPost = await post.create({
                        title: req.body.title,
                        content: req.body.content,
                        profileId: pid,
                        alc: req.body.alc,
                    })
                    res.send(await comment.create({
                        postId: req.body.id,
                        commentId: createdPost.id
                    }))
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 2:
                let friendsoffriends = (await (requestedPost.poster).getFriends())
                let fri = [...friendsoffriends];
                await asyncForEach(friendsoffriends, async (x) => {
                    let t = await x.getFriends()
                    fri.push(t)
                });
                fri = fri.flat()
                if (fri.some(x => x.userId === req.user.id) || requestedPost.poster.userId === req.user.id) {
                    let createdPost = await post.create({
                        title: req.body.title,
                        content: req.body.content,
                        profileId: pid,
                        alc: req.body.alc,
                    })
                    res.send(await comment.create({
                        postId: req.body.id,
                        commentId: createdPost.id
                    }))
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 3:
                res.send(200, 'yet to be implemented')
                break;
            case 4:
                let createdPost = await post.create({
                    title: req.body.title,
                    content: req.body.content,
                    profileId: pid,
                    alc: req.body.alc,
                })
                res.send(await comment.create({
                    postId: req.body.id,
                    commentId: createdPost.id
                }))
                break;
        }
    } else {
        res.send(404, 'not found')
    }
})
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
async function reactionCount(id) {
    return new Promise(async (resolve, reject) => {



        let amount = {

        }
        const types = ['love', 'like', 'dislike', 'thanks', 'good job']
        await asyncForEach(types, async (type) => {
            amount[type] = await reaction.count({ where: { postId: id, reactionType: type } })
        });
        resolve(amount)
    })
}
module.exports = router