const db = require('../../models');
module.exports = async (args, req, t) => {
    const user = await db.user.findOne({ where: { id: req.user.id }, include: [{ model: db.profile }] })
    if (user) {
        return user
    } else {
        return {}
    }
}