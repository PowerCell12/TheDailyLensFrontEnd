import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import handleError from "../../utils/handleError";
import { BlogInfo } from "../../interfaces/BlogInfo";
import DateFormatter from "../../utils/dateUtils";
import { HeaderProps } from "../../interfaces/HeaderProps";


export default function BlogDetail({user, setUser}: HeaderProps){
    const [blogData, setBlogData] = useState<BlogInfo>()
    const [showAdminOptions, setShowAdminOptions] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()


    useEffect(() => {
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
            console.log(data)
            setBlogData(data)
        }).catch(err =>{
            handleError(err, navigate)
        })


    }, [navigate, id])


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

    const tags = ["Global", "Business", "Technology"]

    return (
        <>

            <section className="BlogDetailMain">

                <img className="BlogDetailThumbnail" src={blogData?.thumbnail? blogData.thumbnail : "/BlogThumbnailDefault.png"} alt="" />

                {user.id === blogData?.authorId && (
                    <>
                        <img className="BlogDetailDots" onClick={() => setShowAdminOptions(!showAdminOptions)} src="/dots-settings.png" alt="" />
                    
                        {showAdminOptions &&
                            <section className="BlogDetailAdminOptions">
                                <button onClick={() => {deleteBlogHandler()}}>Delete</button>
                                <button onClick={() => navigate(`/blog/${id}/edit`)}>Edit</button>
                            </section>
                        }   
                    </>
                )}


                <section className="BlogDetailUserInfo">
                    <article className="BlogDetailUser1">
                        <img className="BlogDetailUserImage" src={blogData?.userImageUrl ? `http://localhost:5110/${blogData.userImageUrl}` : "/PersonDefault.png"} alt="" />
                        <span className="BlogDetailUserName">{blogData?.userName}</span>
                    </article>


                    <article className="BlogDetailUser2">
                        <span>{DateFormatter(blogData?.createdAt || "")}</span>
                        <ul className="BlogDetailTags">
                        {tags.map((tag) => {
                            return (
                                <li key={tag}>{tag}</li> // TAG ID
                            )}
                        )}
                        </ul>
                    </article>

                </section>

                <h1 className="BlogDetailTitle">{blogData?.title}</h1>

                <div className="BlogDetailContent" dangerouslySetInnerHTML={{__html: blogData?.content || ""}}></div>                

                {user && (    
                        <section className="BlogDetailCommentButtons">
                            <button className="BlogDetailCommentButtonFirst" onClick={() => {navigate(`/blog/${id}/comments`)}}>Show Comments</button>
                        </section>
                )}

            </section>

        </>

    )


}