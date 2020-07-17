module.exports = `
type Profile {
    id: String!
    first: String!
    last:String!
    settings: Settings
    email:String
    phone:String
    alc:Int
    DOB:String
    profilePicURI: String
}
`;
// module.exports = `
//     type User {
//         id: String!
//         username: String!
//         profile: Profile
//     }

//     type Post {
//         id: String
//         title: String
//         content: String
//         poster: Profile
//         alc: Int
//         visible: String
//         root: Boolean
//     }
//     type Settings { 
//         notifications:String
//     }
//     type Query {
//         Account: User
//         Post(id:String): Post
//     }

// `;
// // type Mutation {

// // }