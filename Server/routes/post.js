var express = require('express')
var router = express.Router()
const passport = require('passport');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
var azure = require('azure-storage');
require('../config/passport.js')(passport);
const { user, profile, postMedia, share, comment, post, reaction } = require('../models');
var blobService = azure.createBlobService('scouthub', 'Xwf+aWpa4rAz9hrbGkJMMUo3tGXFqNJYg/Up05Uz3M180GwAvepo3QqfMmzEnIGwpZLVlvN8FnhyjurH5HnJdg==');
const { v4 } = require('uuid');
// const redis = require('redis');
const { Op } = require("sequelize");
const e = require('express');

// const cache = redis.createClient(32771, 'localhost');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
/*  
    Todo
    limit comment and reaction results to max number and one per user per post
    impressins of oriinal conent are effected by shares as well as share 
    view data usage api track region time user demographics ie age group gender
    track user activity and request and time


*/

// define the home page route
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const puid = (await req.user.getProfile()).userId
    let requestedPost = await post.findOne({ where: { id: req.query.id }, include: [{ model: profile, as: 'poster' }] })
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
    if (!requestedPost) {
        requestedPost = await share.findOne({ where: { id: req.query.id }, include: [{ model: post, as: 'sharedContent', include: [{ model: profile, as: 'poster' }] }, { model: profile, as: 'poster' }] })
        if (requestedPost) {
            if ((new Date() - new Date(requestedPost.sharedContent.updatedAt)) > 30000) {
                requestedPost.sharedContent.update({
                    shareCount: await requestedPost.sharedContent.countShares(),
                    reactionsMeta: await reactionCount(requestedPost.sharedContent.id),
                    commentCount: await requestedPost.sharedContent.countComments(),
                });
            }
            requestedPost.sharedContent.poster.dataValues['friend_friend'] = undefined
            requestedPost.sharedContent.poster.dataValues['email'] = undefined
            requestedPost.sharedContent.poster.dataValues['DOB'] = undefined
            requestedPost.sharedContent.poster.dataValues['phone'] = undefined
            requestedPost.sharedContent.poster.dataValues['createdAt'] = undefined
            requestedPost.sharedContent.poster.dataValues['updatedAt'] = undefined
            requestedPost.sharedContent.poster.dataValues['settings'] = undefined
            requestedPost.sharedContent.poster.dataValues['userId'] = undefined
            requestedPost.sharedContent.poster.dataValues['user_id'] = undefined
            requestedPost.sharedContent.commentCount = await requestedPost.sharedContent.countComments();
            switch (requestedPost.dataValues.alc) {
                case 0:
                    if (requestedPost.sharedContent.poster.userId === req.user.id) {

                        let token = blobService.generateSharedAccessSignature("profilemedia", `${requestedPost.sharedContent.poster.id}.png`, sharedAccessPolicy);
                        let uri = blobService.getUrl("profilemedia", `${requestedPost.sharedContent.poster.id}.png`, token);
                        requestedPost.poster.profilepicuri = uri
                    } else {
                    }
                    break;
                case 1:
                    const friends = (await (requestedPost.poster).getFriends())
                    if (friends.some(x => x.id === req.user.id) || requestedPost.poster.userId === req.user.id) {
                        let token = blobService.generateSharedAccessSignature("profilemedia", `${requestedPost.sharedContent.poster.id}.png`, sharedAccessPolicy);
                        let uri = blobService.getUrl("profilemedia", `${requestedPost.sharedContent.poster.id}.png`, token);
                        requestedPost.poster.profilepicuri = uri
                    } else {
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
                    if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {
                        let token = blobService.generateSharedAccessSignature("profilemedia", `${requestedPost.sharedContent.poster.id}.png`, sharedAccessPolicy);
                        let uri = blobService.getUrl("profilemedia", `${requestedPost.sharedContent.poster.id}.png`, token);
                        requestedPost.poster.profilepicuri = uri
                    } else {
                    }
                    break;
                case 3:
                    break;
                case 4:
                    let token = blobService.generateSharedAccessSignature("profilemedia", `${requestedPost.sharedContent.poster.id}.png`, sharedAccessPolicy);
                    let uri = blobService.getUrl("profilemedia", `${requestedPost.sharedContent.poster.id}.png`, token);
                    requestedPost.poster.profilepicuri = uri
                    break;
            }
        } else {
            res.send(404, 'not fond')
        }
    } else {
        if ((new Date() - new Date(requestedPost.updatedAt)) > 30000) {
            requestedPost.update({
                shareCount: await comment.count({ where: { postId: requestedPost.id } }),
                reactionsMeta: await reactionCount(requestedPost.id),
                commentCount: await comment.count({ where: { postId: requestedPost.id } })
            });
        }
    }
    if (requestedPost) {
        switch (requestedPost.dataValues.alc) {
            case 0:
                if (requestedPost.poster.userId === req.user.id) {

                } else {
                    let token = blobService.generateSharedAccessSignature("profilemedia", `${x.id}.${x.filetype}`, sharedAccessPolicy);
                    let uri = blobService.getUrl("profilemedia", `${requestedPost.poster.id}.png`, token);
                    requestedPost.poster.profilepicuri = uri
                }
                break;
            case 1:
                const friends = (await (requestedPost.poster).getFriends())
                if (friends.some(x => x.id === req.user.id) || requestedPost.poster.userId === req.user.id) {
                } else {
                    let token = blobService.generateSharedAccessSignature("profilemedia", `${x.id}.${x.filetype}`, sharedAccessPolicy);
                    let uri = blobService.getUrl("profilemedia", `${requestedPost.poster.id}.png`, token);
                    requestedPost.poster.profilepicuri = uri
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
                if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {

                } else {
                    let token = blobService.generateSharedAccessSignature("profilemedia", `${x.id}.${x.filetype}`, sharedAccessPolicy);
                    let uri = blobService.getUrl("profilemedia", `${requestedPost.poster.id}.png`, token);
                    requestedPost.poster.profilepicuri = uri
                }
                break;
            case 3:
                break;
            case 4:
                let token = blobService.generateSharedAccessSignature("profilemedia", `${x.id}.${x.filetype}`, sharedAccessPolicy);
                let uri = blobService.getUrl("profilemedia", `${requestedPost.poster.id}.png`, token);
                requestedPost.poster.profilepicuri = uri
                break;
        }
        requestedPost.poster.dataValues['friend_friend'] = undefined
        requestedPost.poster.dataValues['email'] = undefined
        requestedPost.poster.dataValues['DOB'] = undefined
        requestedPost.poster.dataValues['phone'] = undefined
        requestedPost.poster.dataValues['createdAt'] = undefined
        requestedPost.poster.dataValues['updatedAt'] = undefined
        requestedPost.poster.dataValues['settings'] = undefined
        requestedPost.poster.dataValues['userId'] = undefined
        requestedPost.poster.dataValues['user_id'] = undefined

        const pid = (await req.user.getProfile()).id

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
                    requestedPost.update({
                        impressions: (parseInt(requestedPost.impressions) + 1)
                    })
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
                    requestedPost.update({
                        impressions: (parseInt(requestedPost.impressions) + 1)
                    })
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
                if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {
                    let fids = fri.map(x => x.id);
                    requestedPost.dataValues.reaction = await reaction.findAll({
                        where: {
                            postId: req.query.id,
                            profileId: {
                                [Sequelize.Op.in]: fids
                            },
                        }
                    })
                    requestedPost.update({
                        impressions: (parseInt(requestedPost.impressions) + 1)
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
                requestedPost.update({
                    impressions: (parseInt(requestedPost.impressions) + 1)
                })
                res.send(requestedPost)
                break;
        }
    } else {
        res.send(404, 'not found')
    }
})
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const puid = (await req.user.getProfile()).userId
    let requestedPost = await post.findOne({ where: { id: req.query.id }, include: [{ model: profile, as: 'poster' }] })
    if (requestedPost) {

        switch (requestedPost.dataValues.alc) {
            case 0:
                if (requestedPost.poster.userId === req.user.id) {
                    requestedPost.update({
                        impressions: (parseInt(requestedPost.impressions) + 1)
                    })
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
                    requestedPost.update({
                        impressions: (parseInt(requestedPost.impressions) + 1)
                    })
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
                if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {
                    let fids = fri.map(x => x.id);
                    requestedPost.dataValues.reaction = await reaction.findAll({
                        where: {
                            postId: req.query.id,
                            profileId: {
                                [Sequelize.Op.in]: fids
                            },
                        }
                    })
                    requestedPost.update({
                        impressions: (parseInt(requestedPost.impressions) + 1)
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
                requestedPost.update({
                    impressions: (parseInt(requestedPost.impressions) + 1)
                })
                res.send(requestedPost)
                break;
        }
    }
})
router.post('/share', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const requestedPost = await post.findOne({ where: { id: req.body.id }, include: [{ model: profile, as: 'poster' }] })
    if (requestedPost) {
        if ((new Date() - new Date(requestedPost.updatedAt)) > 30000) {
            requestedPost.update({
                shareCount: await comment.count({ where: { postId: requestedPost.id } }),
                reactionsMeta: await reactionCount(requestedPost.id),
                commentCount: await comment.count({ where: { postId: requestedPost.id } })
            });
        }
        switch (requestedPost.dataValues.alc) {
            case 0:
                if (requestedPost.poster.userId === req.user.id) {
                    res.send(await share.create({
                        profileId: (await req.user.getProfile()).id,
                        title: req.body.title,
                        content: req.body.content,
                        alc: req.body.alc,
                        postId: requestedPost.id
                    }))
                } else {
                    res.send(300, 'not valid access')
                }
                break;
            case 1:
                const friends = (await (requestedPost.poster).getFriends())
                if (friends.some(x => x.id === req.user.id) || requestedPost.poster.userId === req.user.id) {
                    res.send(await share.create({
                        profileId: (await req.user.getProfile()).id,
                        title: req.body.title,
                        content: req.body.content,
                        alc: req.body.alc,
                        postId: requestedPost.id,
                        sharedContent: requestedPost
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
                if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {
                    res.send(await share.create({
                        profileId: (await req.user.getProfile()).id,
                        title: req.body.title,
                        content: req.body.content,
                        alc: req.body.alc,
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
                res.send(await share.create({
                    profileId: (await req.user.getProfile()).id,
                    title: req.body.title,
                    content: req.body.content,
                    alc: req.body.alc,
                    postId: requestedPost.id
                }))
                break;
        }
    } else {
        res.send(404, 'not found')
    }
})
router.post('/delete', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let pid = (await req.user.getProfile()).id
    let requestedPost = await post.findOne({ where: { id: req.query.id }, include: [{ model: comment, as: 'comments', include: [{ model: post, as: 'comment' }] }, { model: profile, as: 'poster' }] })
    if (requestedPost) {
        if (pid === requestedPost.profileId) {
            res.send(await requestedPost.update({ visible: 'deleted' }))
        } else {
            res.send(400, 'not your post')
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
    res.send(createdPost)
})
router.post('/reaction', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let requestedPost = await post.findOne({ where: { id: req.body.id }, include: [{ model: comment, as: 'comments', include: [{ model: post, as: 'comment' }] }, { model: profile, as: 'poster' }] })
    if (requestedPost) {
        const puid = (await req.user.getProfile()).userId
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
                if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {
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
router.get('/comment', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let size = parseInt(req.query.size ? req.query.size : 1)
    if (size > 50) {
        size = 50
    } else if (size < 4) {
        size += 2;
    }
    console.log(size)
    let requestedComments = await comment.findAll({ where: { post_id: req.query.id }, distinct: true, offset: (req.query.start ? req.query.start : 0), limit: size, include: [{ model: post, as: 'commentPost', include: [{ model: profile, as: 'poster', attributes: ['first', 'last', 'alc', 'id'] }] }] })
    const puid = (await req.user.getProfile()).userId
    if (requestedComments) {
        let comments = [];
        let pid = (await req.user.getProfile()).id
        await asyncForEach(requestedComments, (async (x) => {
            requestedPost = x.commentPost

            switch (requestedPost.dataValues.alc) {
                case 0:
                    if (requestedPost.poster.userId === req.user.id) {
                        comments.push(requestedPost)
                        await requestedPost.update({
                            impressions: (parseInt(requestedPost.impressions) + 1)
                        })
                    } else {
                    }
                    break;
                case 1:
                    const friends = (await (requestedPost.poster).getFriends())
                    if (friends.some(x => x.id === req.user.id) || requestedPost.poster.userId === req.user.id) {
                        comments.push(requestedPost)
                        await requestedPost.update({
                            impressions: (parseInt(requestedPost.impressions) + 1)
                        })
                    } else {
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
                    if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {
                        comments.push(requestedPost)
                        await requestedPost.update({
                            impressions: (parseInt(requestedPost.impressions) + 1)
                        })
                    } else {
                    }
                    break;
                case 3:
                    break;
                case 4:
                    comments.push(requestedPost)
                    await requestedPost.update({
                        impressions: (parseInt(requestedPost.impressions) + 1)
                    })
                    break;
            }
        }))
        res.status(200).send(comments)
    } else {
        res.status(404).send('not found')
    }
})
router.post('/comment', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let requestedPost = await post.findOne({ where: { id: req.body.id }, include: [{ model: comment, as: 'comments', include: [{ model: post, as: 'commentPost' }] }, { model: profile, as: 'poster' }] })
    if (requestedPost) {
        const puid = (await req.user.getProfile()).userId
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
                if (fri.some(x => x.userId === req.user.id) || puid === req.user.id) {
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
    await Promise.all(array.map(async (item, index) => {
        await callback(item, index, array);
    }))
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