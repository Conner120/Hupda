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
    user
      .findByPk(jwt_payload.id)
      .then((user) => done(null, user))
      .catch((error) => done(error, false));
  })));
};
function getCookie(cname, req) {
  var name = cname + "=";
  var ca = req.headers.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
var cookieExtractor = function (req) {
  let token = null;
  if (req.headers.jwt == null) {
    if (req && req.headers.cookie) { token = getCookie('jwt', req) }
  }
  else {
    token = req.headers.jwt
  }
  return token;
};
