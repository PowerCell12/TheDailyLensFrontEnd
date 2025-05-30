import { useEffect, useRef, useState } from "react";
import { CommentBlog } from "../../interfaces/BlogInfo";
import { CommentAuthorData } from "../../interfaces/HeaderProps";
import DateFormatter from "../../utils/dateUtils";
import handleError from "../../utils/handleError";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { CommentProps } from "../../interfaces/Comment";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";



export default function Comment({ 
    id, title, content,
    authorId,  createdAt, setBlogData, 
    blogData, setIsEditing, setIsReplaying,
    setCommentId, replyingToReply, setReplyingToReply,
    parentCommentId, setNeedsTitleOrEditorData
} : CommentProps)
{
    const { user } = useAuth();
    const [author, setAuthor] = useState<CommentAuthorData>({"name": "defaultName", "imageUrl": "/PersonDefault.png"});
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef<HTMLDivElement | null>(null);
    const [isLiked, setIsLiked] = useState(user.likedComments.includes(id));
    const [isDisliked, setIsDisliked] = useState(user.dislikedComments.includes(id));
    const [deleteButtonClicked, setDeleteButtonClicked] = useState(false)
    const [DELETEWritten, setDELETEWritten] = useState(false)
    const navigate = useNavigate();

    const replyProps =  { user, setBlogData, blogData, setIsEditing, setIsReplaying, setCommentId, replyingToReply, setReplyingToReply };

    useEffect(() => {
        setIsLiked(user.likedComments.includes(id));
        setIsDisliked(user.dislikedComments.includes(id));
    }, [user, id])


    useEffect(() => {
        // @ts-expect-error this is BS
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
              setIsOpen(false);
            }
          };


          document.addEventListener('mousedown', handleClickOutside);
          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
          };

   
    }, [])


    useEffect(() => {
        fetch(`http://localhost:5110/user/${authorId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }            
          }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
          }).then(data => {
            if (data.imageUrl == "/PersonDefault.png" || data.imageUrl == null || data.imageUrl == undefined || data.imageUrl == ""){
                setAuthor({name: data.name, imageUrl: "/PersonDefault.png"})
            }
            else{
                setAuthor({name: data.name, imageUrl: `http://localhost:5110/${data.imageUrl}`})
            }
          }).catch(err => {
            handleError(err, navigate)
          })
    }, [navigate, authorId])


    function likedHandler(isLiked: boolean){
        fetch(`http://localhost:5110/comment/${id}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({isLiked: !isLiked})
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then(data => {
            setIsLiked(!isLiked);
            setBlogData((prevData: CommentBlog[]) => prevData.map(comment => {
                if (comment.id == id){
                    return {...comment, likes: data}
                }
                return comment
            }))
        }).catch(err => {
            handleError(err, navigate)
        })
    }

    function dislikeHandler(isDisliked: boolean){
        fetch(`http://localhost:5110/comment/${id}/dislike`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({isLiked: !isDisliked})
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then(data => {
            setIsDisliked(!isDisliked);
            setBlogData((prevData: CommentBlog[]) => 
                prevData.map(comment => {
                if (comment.id == id){
                    return {...comment, dislikes: data}
                }
                return comment 
            }))
        }).catch(err => {
            handleError(err, navigate)
        })
    }


    function removeCommentHandler(){

        fetch(`http://localhost:5110/comment/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(() => {
            setBlogData((prevBlogData: CommentBlog[]) => prevBlogData.filter(comment => comment.id !== id))
        }).catch(err => {
            handleError(err, navigate)
        })

    }



    return (
        <section className={parentCommentId == null ? `CommentSection` : `RepliedCommentSection`}>
            {deleteButtonClicked && 
                <DeleteConfirmation setDeleteButtonClicked={setDeleteButtonClicked} deleteHandler={removeCommentHandler} DELETEWritten={DELETEWritten} setDELETEWritten={setDELETEWritten} titleWord="Comment" sentence="Are you sure you want to delete this comment?" />
            }
            
            <article className="CommentHeaderAccount">
                <section>
                    <img onClick={() => {navigate(`/profile/${author.name}`)}} src={author?.imageUrl} alt="" />           

                    <article className="CommentHeader">
                        <span>{DateFormatter(createdAt)}</span>
                        <h1 onClick={() => {navigate(`/profile/${author.name}`)}}>{author?.name}</h1>
                    </article>            
                </section>

                {(authorId === user.id || user.accountType === 1) && (
                    <article className="EditRemoveCommentSection" ref={dropDownRef}>
                        <img onClick={(e) => {e.stopPropagation(); setIsOpen(!isOpen) }} className="dropDownButton" src="/dots-settings.png" alt="" />
                        {isOpen && (
                                <div  className="EditRemoveCommentButtons">
                                    <button onClick={() => {setIsEditing(true); setIsReplaying(false); setCommentId(id); setIsOpen(false); setNeedsTitleOrEditorData(false)}} className="EditCommentButton">Edit</button>
                                    <button onClick={() => {setDeleteButtonClicked(true)}} className="RemoveCommentButton">Remove</button>
                                </div>
                        )}

                    </article>
                )}
            </article>


            <article className="CommentContent">

                {parentCommentId != null && (

                    <h3 className="RepliedTo" onClick={() => {navigate(`/profile/${title.split(" ")[0].replace("@", "")}`)}}>{title}</h3>
                )}

                {parentCommentId == null && (
                    <h3>{title}</h3>
                )}

                <p dangerouslySetInnerHTML={{__html: content}}></p>

            </article>

            <article className="CommentFooter">
                
                <article>
                    <div onClick={() => {likedHandler(isLiked)}}>
                        {isLiked && (
                            <img className="like" src="/likeClicked.png" alt="" />        
                        )}
                        {!isLiked && (
                            <img className="like" src="/like.png" alt="" />
                        )}
                    </div>
                    <span>{blogData ? blogData.find((x: CommentBlog) => x.id == id)?.likes ?? 0 : 0}</span>
                </article>

                <article>
                    <div onClick={() => {dislikeHandler(isDisliked)}}>
                        {isDisliked && (
                            <img className="dislike" src="/dislikeClicked.png" alt="" />        
                        )}
                        {!isDisliked && (
                            <img className="dislike" src="/dislike.png" alt="" />
                        )}
                    </div>
                    <span>{blogData ? blogData.find((x: CommentBlog) => x.id == id)?.dislikes ?? 0 : 0}</span>
                </article>

                <button onClick={() => {setIsReplaying(true); setIsEditing(false); setCommentId(id); setIsOpen(false); setNeedsTitleOrEditorData(false);
                    if (blogData && blogData.filter(x => x.parentCommentId == id).length > 0){
                        setReplyingToReply(true)
                    }
                }} className="ReplyCommentButton">Reply</button>
            </article>



            {blogData && blogData.filter((x: CommentBlog) => x.parentCommentId == id).length > 0 && (
                <section  className={parentCommentId == null ? `RepliesSection` : `RepliedRepliesSection`}>
                    {blogData.filter((x: CommentBlog) => x.parentCommentId == id).map((reply: CommentBlog) => {
                        return (
                            <Comment key={reply.id} {...reply} {...replyProps} id={reply.id} />
                        )
                    })}
                </section>
            )}


        </section>
    )



}