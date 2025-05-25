import { CommentBlog } from "./BlogInfo";

export interface CommentProps {
    id: number;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    setBlogData: React.Dispatch<React.SetStateAction<CommentBlog[]>>;
    blogData: CommentBlog[] | undefined;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setIsReplaying: React.Dispatch<React.SetStateAction<boolean>>;
    setCommentId: React.Dispatch<React.SetStateAction<number>>;
    replyingToReply: boolean;
    setReplyingToReply: React.Dispatch<React.SetStateAction<boolean>>;
    commentId: number;
    setNeedsTitleOrEditorData: React.Dispatch<React.SetStateAction<boolean>>;
    parentCommentId: number
}


export interface PostedCommentsInterface{
    id: number;
    title: string;
    createdAt: string;
    content: string;
    likes: number;
    dislikes: number;
    isLiked: boolean,
    isDisliked: boolean;
    blogId: number;
    show: boolean;
}