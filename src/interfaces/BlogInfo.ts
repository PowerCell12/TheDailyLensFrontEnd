export interface BlogInfo {
 id: number;
 title: string;
 thumbnail: string;
 content: string;
 likes: number;
 createdAt: string;
 authorId: string;
 userImageUrl: string;
 userName: string;
 tags: string[];
}

export interface CommentBlog{
    id :number,
    title: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    authorId: number,
    ParentCommentId: number,
}

