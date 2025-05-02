import { useEffect, useState } from "react";
import handleError from "../../utils/handleError";
import { useNavigate } from "react-router-dom";
import { BlogInfo } from "../../interfaces/BlogInfo";
import DateFormatter from "../../utils/dateUtils";
import { HeaderProps } from "../../interfaces/HeaderProps";


export default function PostedBlogs({user}: HeaderProps) {
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState<BlogInfo[]>([])


    useEffect(() => {
        fetch(`http://localhost:5110/user/${user.name}/getBlogsByUser`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(async (res) => {
            if (!res.ok) {
                const message = await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }

            return res.json()
        }).then(data => {
            setBlogs(data["$values"])
            console.log(data["$values"])
        }).catch(err => {
            handleError(err, navigate)
        })


    }, [])


    const customTags = ["javascript", "typescript", "python", "java", "csharp"]


    return(
        <>
            {blogs.length === 0 ? <h1 className="PostedBlogsTitle">No blogs found</h1> : <h1 className="PostedBlogsTitle">Posted Blogs by {blogs[0].userName}</h1>}

            <section className={blogs.length > 0 ? "PostedBlogs" : undefined}>
               
                {blogs.map(blog => {
                    return(
                        <section key={blog.id} className="BlogCard" onClick={() => {navigate(`/blog/${blog.id}`)}}>
                            <img className="BlogThumbnail" src={blog.thumbnail} alt="thumbnail" />
                            <section className="BlogInfo">
                                <section className="BlogUserInfo">
                                    <img className="BlogUserImage" src={`http://localhost:5110/${blog.userImageUrl}` || "/BlogThumbnailDefault.png"} alt="" />
                                    <p>{blog.userName}</p>
                                </section>
                                <section className="BlogInfoDetails">
                                    <span>{DateFormatter(blog.createdAt)}</span>
                                    <ul className="BlogTagsList">
                                        {customTags.slice(0, 4).map((tag, index) => {
                                            return(
                                                <li key={index} className={"BlogTags"}>{tag}</li>
                                            )
                                        })}
                                    </ul>
                                </section>
                            </section>  

                            <h2 className="BlogTitle">{blog.title}</h2>
                            <p className="BlogContent" dangerouslySetInnerHTML={{__html: blog.content}}></p>

                        </section>
                    )
                })}

            
            </ section>
        </ >
    )

}