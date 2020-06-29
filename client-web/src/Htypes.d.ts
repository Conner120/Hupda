
export interface Post {
    "id": "5c0f091d-4353-4092-9df7-126785333d21",
    id: string,
    title: string,
    postId: string,
    content: string,
    profileId: string,
    alc: number,
    visible: string,
    createdAt: Date,
    updatedAt: Date,
    shareCount: number,
    poster: ProfileMin,
    reactionMeta?: ReactionMeta,
    comments: [Post],
    rootPost?: Post,
    root?: boolean,
    sharedContent?: Post,
}
export interface ProfileMin {
    "id": string,
    "first": string,
    "last": string,
    "alc": number,
    "profilepicuri": string
}
export interface ReactionMeta {
    "love": number,
    "like": number,
    "thanks": number,
    "dislike": number,
    "good job": number
}
