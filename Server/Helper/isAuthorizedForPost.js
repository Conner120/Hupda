module.exports = async function (requestedPost, yourUser) {
    return new Promise(async (resolve, reject) => {
        const puid = (await yourUser.getProfile()).userId
        switch (requestedPost.dataValues.alc) {
            case 0:
                if (requestedPost.poster.userId === yourUser.id) {
                    resolve(true)
                } else {
                    resolve(false)
                }
                break;
            case 1:
                const friends = (await (requestedPost.poster).getFriends())
                if (friends.some(x => x.id === puid) || requestedPost.poster.userId === yourUser.id) {
                    resolve(true)
                } else {
                    resolve(false)
                }
                break;
            case 2:
                let friendsoffriends = (await (requestedPost.poster).getFriends())
                let fri = [...friendsoffriends];
                await asyncForEach(friendsoffriends, async (x) => {
                    let t = await x.getFriends()
                    fri.push(t)
                });
                fri = fri.flat()
                if (fri.some(x => x.userId === yourUser.id) || yourUser.id === yourUser.id) {
                    resolve(true)
                } else {
                    resolve(false)
                }
                break;
            case 3:
                resolve(false)
                break;
            case 4:
                resolve(true)
                break;
        }
    })
}
async function asyncForEach(array, callback) {
    await Promise.all(array.map(async (item, index) => {
        await callback(item, index, array);
    }))
}