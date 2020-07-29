let express = require('express')
let path = require('path')
let app = express()
const passport = require('passport');
const Sequelize = require('sequelize');
const { decodedToken } = require('./Helper')
const jwt = require('jsonwebtoken');
require('./config/passport.js')(passport);
const cookieParser = require('cookie-parser');
const logResponseTime = require("./response-time-logger");
const db = require('./models');
const { post } = require('./routes')
const typeDefs = require("./graphql/Types");
const resolvers = require("./Graphql/Resolvers/");
let { ApolloServer, gql } = require("apollo-server");
const profileRouter = require('./routes/profile')
var compression = require('compression')
var { buildSchema } = require('graphql');
app.use(express.json())
app.use(logResponseTime);
app.use('/api/post', post)
authSecret = "ConnerRocks"
app.use('/api/profile', profileRouter)
const expressPlayground = require('graphql-playground-middleware-express')
    .default


app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
// app.use(express.static('public'))
app.use(compression({ filter: shouldCompress }))
// const server = new ApolloServer({
//     typeDefs: gql(typeDefs),
//     resolvers,
// });
app.use('/graphql', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (user) {
            req.user = user
        }
        if (user) {
            next()
        } else {
            if (req.method == "POST") {
                // res.send({ errors: [{ message: "Unauthorized" }] })
            } else {
                next()
            }
        }
    })(req, res, next)
})
// const server = new ApolloServer({
//     typeDefs: gql(typeDefs),
//     resolvers,
//     subscriptionsEndpoint: `ws://localhost:3000/subscriptions`,

//     context: (req) => {
//         return req
//     }
// });
// server.applyMiddleware({ app });

// app.use('/graphql', ApolloServer({
//     typeDefs: gql(typeDefs),
//     resolvers,
//     graphiql: {
//         headerEditorEnabled: true
//     },
//     subscriptions: {
//         onConnect: (connectionParams, webSocket) => {
//             // var decoded = jwt.verify(webSocket.upgradeReq.headers.cookie., 'wrong-secret');
//             console.log(webSocket.upgradeReq.headers.cookie)
//         }
//     },
// }))

// Construct a schema, using GraphQL schema language
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}
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
// app.listen(4000 || process.env.PORT, () => {
//     console.log(`🚀 Server ready at http://localhost:4000`)

// })
const server = new ApolloServer({
    typeDefs: gql(typeDefs),
    resolvers,
    tracing: true,

    subscriptionsEndpoint: `ws://localhost:4000/subscriptions`,

    context: async (req) => ({
        db,
        req: req.req,
        profile: (req.req) ? await decodedToken(req.req, false) : {}

    })
});
// server.applyMiddleware({ app });

server.listen().then(({ url, subscriptionsUrl, subscriptionsPath }) => {
    console.log(`🚀  Server ready at ${url}`);
    console.log(`realtime here at ${subscriptionsUrl} and path ${subscriptionsPath}`)
});