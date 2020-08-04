module.exports = `
type Post {
    id: String
    title: String
    content: String
    poster: Profile
    alc: Int
    visible: String
    reactions: ReactionMeta
    root: Boolean
    createdAt:String
}
`;
