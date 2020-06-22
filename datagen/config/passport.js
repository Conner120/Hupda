const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

// load up the user model
const { user } = require('../models');

module.exports = function (passport) {
  const opts = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: 'ConnerRocks',
  };
  passport.use('jwt', new JwtStrategy(opts, ((jwt_payload, done) => {
    console.log(jwt_payload)
    user
      .findByPk(jwt_payload.id)
      .then((user) => done(null, user))
      .catch((error) => done(error, false));
  })));
};
var cookieExtractor = function (req) {
  let token = null;
  if (req.headers.jwt == null) {
    if (req && req.cookies) { token = req.cookies.jwt; }
  }
  else {
    token = req.headers.jwt
  }
  return token;
};
