const redis = require('redis');

const cache = redis.createClient(32771, '10.0.0.112');
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
