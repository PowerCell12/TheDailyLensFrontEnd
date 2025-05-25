import { useNavigate, useSearchParams } from "react-router-dom"
import DateFormatter from "../../utils/dateUtils"
import { BlogInfo } from "../../interfaces/BlogInfo"
import { useEffect, useRef, useState } from "react"
import usePagination from "../../hooks/usePagination"
import PaginationButtons from "../PaginationButtons/PaginationButtons"
import SortingComponent from "../SortingComponent/SortingComponent"

type SavedBlogsProps = {
    blogs: BlogInfo[],
    title :string,
    setBlogs: React.Dispatch<React.SetStateAction<BlogInfo[]>>
}

export default function SavedBlogs({blogs, setBlogs, title}: SavedBlogsProps){
    const [searchParams, setSearchParams] = useSearchParams();
    const search_query2 = searchParams.get("page")

    const [page, setPage] = useState(search_query2);
    const ItemsPerPage = 4; // 6
    const { currentPage, totalPages, CanGoNext, CanGoPrev,  goNext, goPrev, goToPage, paginatedData} = usePagination({data: blogs,  itemsPerPage: ItemsPerPage, initialPage: Number(page), setSearchParams})
  
    const sortingRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);

    const navigate = useNavigate()


    useEffect(() => {
        const sortHandle = (e) => {
            if (sortingRef.current && !sortingRef.current.contains(e.target as Node)) {
                setShow(false);
            }   
        }

        document.addEventListener("mousedown", sortHandle)
        return () => {document.removeEventListener("mousedown", sortHandle)}

    }, [])

    useEffect(() => {
        setPage(searchParams.get("page"));
    }, [searchParams]);

    
    console.log(totalPages)

    return(
            <>
                {((Number(page) < 1 || Number(page) > totalPages) && totalPages !== 0) && (
                    <h1 className="PostedBlogsTitle">Please enter a page number between 1 and {totalPages}</h1>
                )}

                {(totalPages == 0 || (paginatedData.length == 0 && (Number(page) >= 1 && Number(page) <= totalPages))) && (
                    <h1 className="PostedBlogsTitle">No Blogs Found</h1>
                )}

                {(totalPages > 0 && (Number(page) >= 1 && Number(page) <= totalPages)) && <h1 className="PostedBlogsTitle">{title} Blogs By {blogs[0].userName}</h1>}
    
                
                <section className={(totalPages > 0 && (Number(page) >= 1 && Number(page) <= totalPages)) ? "PostedBlogs" : undefined}>
                    {totalPages > 0 && <SortingComponent text={"Blogs"} setShow={setShow} show={show} sortingRef={sortingRef} setData={setBlogs}   />}
                 
                    {paginatedData.map((blog: BlogInfo) => {
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
                                            {blog.tags["$values"].slice(0, 4).map((tag, index) => {
                                                return(
                                                    <li key={index} title={tag} className={"BlogTagsSavedBlogs"}>{tag}</li>
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
    
                
                    {(blogs.length > ItemsPerPage && (totalPages > 0 && (Number(page) >= 1 && Number(page) <= totalPages)) ) && (
                        <PaginationButtons itemsPerPage={ItemsPerPage} totalPages={totalPages} dataLength={blogs.length} canGoNext={CanGoNext} canGoPrev={CanGoPrev} currentPage={currentPage} goToPage={goToPage}  goNext={goNext} goPrev={goPrev}/>
                    )}
                    

                </ section>
            </ >
        )
}