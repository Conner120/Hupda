const db = require('../../../models');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('../../../config/passport.js')(passport); module.exports = async (root, args, { req, db, profile }, info) => {
    let user = await db.user
        .findOne({
            where: {
                username: args.username
            },
        })
    console.log(user)
    if (!user) {
        return res.status(401).send({
            message: 'Authentication failed. User not found.',
        });
    }
    console.log("test")

    if (user.comparePassword(args.password)) {
        const token = jwt.sign(JSON.parse(JSON.stringify({ id: user.id })), authSecret, { expiresIn: 86400 * 30 });
        jwt.verify(token, authSecret, (erer, data) => {
            console.log(erer, data);
        });
        // res.cookie('jwt', token)
        return ({ success: true, jwt: token });
    } else {
    }
}