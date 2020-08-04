module.exports = `
Post(id:String): Post
MyPosts(page:Int,size:Int):[Post]
Comments(id:String,offset:Int):[Comment]
PostCount(Profile:String):PostCount
`;