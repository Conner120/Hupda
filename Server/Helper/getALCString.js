module.exports = function (alc) {
    switch (alc) {
        case 0:
            return 'must be your post.'
            break;
        case 1:
            return 'must be a friend of the poster.'
            break;
        case 2:
            return 'must be a friend of a friend of the poster.'
            break;
        case 4:
            return 'weird?'
            break;
        default:
            return 'DONNO'
            break;
    }
}
