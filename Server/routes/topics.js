const redis = require('redis');

const cache = redis.createClient(32771, 'localhost');
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
