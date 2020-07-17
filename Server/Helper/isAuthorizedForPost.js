module.exports = async function (requestedPostALC, posterProfile, yourUser) {
    return new Promise(async (resolve, reject) => {
        switch (requestedPostALC) {
            case 0:
                console.log('resd')
                if (posterProfile.id === yourUser.id) {
                    resolve(true)
                } else {
                    resolve(false)
                }
                break;
            case 1:
                console.log('resd')
                const friends = (await (posterProfile).getFriends())
                if (friends.some(x => x.id === yourUser.id) || posterProfile.id === yourUser.id) {
                    resolve(true)
                } else {
                    resolve(false)
                }
                break;
            case 2:
                let friendsoffriends = (await posterProfile.getFriends())
                let fri = [...friendsoffriends];
                console.log(yourUser.id)
                await asyncForEach(friendsoffriends, async (x) => {
                    let t = await x.getFriends()
                    fri.push(t)
                });
                fri = fri.flat()
                if (fri.some(x => x.id === yourUser.id) || posterProfile.id === yourUser.id) {
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