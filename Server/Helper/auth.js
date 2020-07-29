const jwt = require('jsonwebtoken');
const db = require('../models');

const decodedToken = (req, requireAuth = true) => {
    return new Promise(async (resolve, reject) => {


        const header = req.headers.jwt;

        if (header) {
            const token = header.replace('jwt ', '');
            let decoded = {}
            try {
                decoded = jwt.verify(token, 'ConnerRocks');
                const profile = await db.profile.findOne({ where: { userId: decoded.id } })
                if (!profile) {
                    reject('Login in to access resource');
                } else {
                    resolve(profile)
                }
            } catch (e) {
                resolve()
            }

        } else {
            if (requireAuth) {
                reject('Login in to access resource');

            } else {
                resolve(false)
            }
        }
    })
}
module.exports = { decodedToken } 