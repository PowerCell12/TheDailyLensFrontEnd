
export interface SearchBlog {
    id: string,
    title : string,
    thumbnail: string,
    likes: number,
    createdAt: string,
    authorId: string,
    userImageUrl: string,
    userName: string,
    tags: string[]
}