let express = require('express')
let path = require('path')
let app = express()
const passport = require('passport');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
require('./config/passport.js')(passport);
const cookieParser = require('cookie-parser');
const logResponseTime = require("./response-time-logger");
const { user, profile } = require('./models');
const { post } = require('./routes')
const profileRouter = require('./routes/profile')
app.use(express.json())
app.use(logResponseTime);
app.use('/post', post)
authSecret = "ConnerRocks"
app.use('/profile', profileRouter)

//app.use(express.json());
//configure app to serve static files from public folder
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "conner.rocks"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const cors = require('cors')

const corsOptions = {
    origin: 'https://sso.scouthub.conner.rocks'
}
app.post('/auth', cors(corsOptions), (req, res, next) => {
    user
        .findOne({
            where: {
                username: req.body.username
            },
        })
        .then((user) => {
            console.log(user)
            if (!user) {
                return res.status(401).send({
                    message: 'Authentication failed. User not found.',
                });
            }
            console.log("test")
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    const token = jwt.sign(JSON.parse(JSON.stringify(user)), authSecret, { expiresIn: 86400 * 30 });
                    jwt.verify(token, authSecret, (erer, data) => {
                        console.log(erer, data);
                    });
                    // res.cookie('jwt', token)
                    res.json({ success: true, jwt: token });
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send(error);
        });
});

app.post('/signup', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({ msg: 'Please pass username and password.' });
    } else {
        user
            .findOne({

                where: {
                    username: {
                        [Sequelize.Op.like]: req.body.username

                    }
                },
            }).then((requser) => {
                let { role } = req.body;
                if (role == null) {
                    role = 0;
                }
                if (!requser) {
                    user
                        .create({
                            username: req.body.username,
                            password: req.body.password,
                            role,
                        })
                        .then((createdUser) => {
                            profile
                                .create({
                                    username: req.body.username,
                                    first: req.body.first,
                                    last: req.body.last,
                                    userId: createdUser.id,
                                    DOB: req.body.DOB
                                })
                                .then((profile) => {
                                    const token = jwt.sign(JSON.parse(JSON.stringify(createdUser)), authSecret, { expiresIn: 86400 * 30 });
                                    jwt.verify(token, authSecret, (erer, data) => {
                                        console.log(erer, data);
                                    });
                                    res.status(200).send({ createdUser, profile, jwt: token })
                                })
                                .catch((error) => {
                                    res.status(400).send(error);
                                    console.log(error)
                                });
                        })
                        .catch((error) => {
                            res.status(400).send(error);
                        });
                } else {
                    res.status(404).send({ msg: 'username is taken' });
                }
            });
    }
});
app.post('/signup', cors(corsOptions), (req, res, next) => {
    user
        .findOne({
            where: {
                username: req.body.username
            },
        })
        .then((user) => {
            console.log(user)
            if (!user) {
                return res.status(401).send({
                    message: 'Authentication failed. User not found.',
                });
            }
            console.log(process.env.authSecret)
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    const token = jwt.sign(JSON.parse(JSON.stringify(user)), authSecret, { expiresIn: 86400 * 30 });
                    jwt.verify(token, authSecret, (erer, data) => {
                        console.log(erer, data);
                    });
                    // res.cookie('jwt', token)
                    res.json({ success: true, jwt: token });
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send(error);
        });
});
getToken = function (headers) {
    console.log(headers);
    if (headers && headers.authorization) {
        // console.log(headers)
        const parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        }
        return null;
    }
    return null;
};
var cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) token = req.cookies.jwt;
    return token;
};
app.listen(3000 || process.env.PORT, () => {
    console.log("Server listening on port 3000")
})