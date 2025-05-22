import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import handleError from "../../utils/handleError";
import { BlogInfo } from "../../interfaces/BlogInfo";
import DateFormatter from "../../utils/dateUtils";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";
import { useAuth } from "../../contexts/useAuth";


export default function BlogDetail(){
    const { user } = useAuth();
    const [blogData, setBlogData] = useState<BlogInfo>()
    const [showAdminOptions, setShowAdminOptions] = useState(false)
    const [deleteButtonClicked, setDeleteButtonClicked] = useState(false)
    const [DELETEWritten, setDELETEWritten] = useState(false)
    const dropDownRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate()
    const { id } = useParams()
    const [liked, setLiked] = useState(user.likedBlogs.includes(Number(id)))

    useEffect(() => {
        console.log(user.id)
        window.scrollTo(0, 0);
        

        fetch(`http://localhost:5110/blog/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }}).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then(data => {
            setBlogData({
                ...data,
                tags: data.tags["$values"]
            })
            setLiked(data.likedUsers["$values"].includes(user.id))
        }).catch(err =>{
            handleError(err, navigate)
        })


    }, [navigate, id, user.id])


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
              setShowAdminOptions(false);
            }
          };

          document.addEventListener('mousedown', handleClickOutside);
          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
          };
      });


    function deleteBlogHandler(){

        fetch(`http://localhost:5110/blog/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(() => {
            navigate("/")
        }).catch(err => {
            handleError(err, navigate)
        })

    }

    
    function likeHandler(){

        fetch(`http://localhost:5110/blog/${id}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({liked: !liked})
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then(data => {

            setLiked(!liked)
            setBlogData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    likes: data
                };
            })

        }).catch(err =>{
            handleError(err, navigate)
        })

    }

    
    return (
        <>
            <section className="BlogDetailMain">
                {deleteButtonClicked && (
                    <DeleteConfirmation setDeleteButtonClicked={setDeleteButtonClicked} deleteHandler={deleteBlogHandler} DELETEWritten={DELETEWritten} setDELETEWritten={setDELETEWritten} />
                )}

                <img className="BlogDetailThumbnail" src={blogData?.thumbnail? blogData.thumbnail : "/BlogThumbnailDefault.png"} alt="" />

                {user.id === blogData?.authorId && (
                    <article ref={dropDownRef} className="BlogDetailAdmin">
                        <img className="BlogDetailDots" onClick={(e) => {e.stopPropagation(); setShowAdminOptions(!showAdminOptions)}} src="/dots-settings.png" alt="" />
                    
                        {showAdminOptions &&
                                <section className="BlogDetailAdminOptions" >
                                    <button onClick={() => {setDeleteButtonClicked(true); setShowAdminOptions(false); window.scrollTo(50, 50)}}>Delete</button>
                                    <button onClick={() => navigate(`/blog/${id}/edit`)}>Edit</button>
                                </section>
                        }   
                    </ article>
                )}


                <section className="BlogDetailUserInfo">
                    <article className="BlogDetailUser1">
                        <img className="BlogDetailUserImage" src={(blogData?.userImageUrl && blogData.userImageUrl !== "/PersonDefault.png" ) ? `http://localhost:5110/${blogData.userImageUrl}` : "/PersonDefault.png"} alt="" />
                        <Link to={`/profile/${blogData?.userName}`} className="BlogDetailUserName">{blogData?.userName}</Link>
                    </article>


                    <article className="BlogDetailUser2">
                        <span>{DateFormatter(blogData?.createdAt || "")}</span>
                        <ul className="BlogDetailTags">
                        {blogData?.tags?.map((tag) => {
                            return (
                                <li title={tag} key={tag}>{tag}</li> // TAG ID
                            )}
                        )}
                        </ul>
                    </article>

                </section>

                <h1 className="BlogDetailTitle">{blogData?.title}</h1>

                <div className="BlogDetailContent" dangerouslySetInnerHTML={{__html: blogData?.content || ""}}></div>                

                <section className="BlogDetailCommentButtons">
                    <article className={user.id == "0" ? "BlogDetailCommentButtonsArticleNoUser" :`BlogDetailCommentButtonsArticle`}  onClick={() => {if (user.id !== "0") likeHandler()}}>
                        <img src={liked ? "/likeClicked.png" : "/like.png"} alt="" />
                        <span>{blogData?.likes}</span>
                    </article>
                    <button className="BlogDetailCommentButtonFirst" onClick={() => {navigate(`/blog/${id}/comments`)}}>Show Comments</button>
                </section>
        

            </section>

        </>

    )


}