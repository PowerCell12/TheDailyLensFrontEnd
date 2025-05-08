import { useNavigate } from "react-router-dom"
import DateFormatter from "../../utils/dateUtils"
import { BlogInfo } from "../../interfaces/BlogInfo"

type SavedBlogsProps = {
    blogs: BlogInfo[],
    customTags: string[],
    title :string
}

export default function SavedBlogs({blogs, customTags, title}: SavedBlogsProps){
    const navigate = useNavigate()

    return(
            <>
                {blogs.length === 0 ? <h1 className="PostedBlogsTitle">No Blogs Found</h1> : <h1 className="PostedBlogsTitle">{title} Blogs By {blogs[0].userName}</h1>}
    
                <section className={blogs.length > 0 ? "PostedBlogs" : undefined}>
                   
                    {blogs.map((blog: BlogInfo) => {
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