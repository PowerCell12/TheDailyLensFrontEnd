import { useEffect, useRef, useState } from "react";
import PaginationButtons from "../PaginationButtons/PaginationButtons";
import {  useNavigate, useSearchParams } from "react-router-dom";
import usePagination from "../../hooks/usePagination";
import handleError from "../../utils/handleError";
import SortingComponent from "../SortingComponent/SortingComponent";
import DateFormatter from "../../utils/dateUtils";
import { useAuth } from "../../contexts/useAuth";
import { PostedCommentsInterface } from "../../interfaces/Comment";
import { stripHtml } from "../../utils/htmlUtils";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";


export function PostedComments(){
   const [searchParams, setSearchParams] = useSearchParams();
    const search_query2 = searchParams.get("page")

    const [page, setPage] = useState(search_query2);
    const ItemsPerPage = 4;

    const [deleteCommentConf, setDeleteCommentConf] = useState(false);
    const [DELETEWritten, setDELETEWritten] = useState(false);

    const [results, setResults] = useState<PostedCommentsInterface[]>([]);
    const [show, setShow] = useState(false);
    const { currentPage, totalPages, CanGoNext, CanGoPrev,  goNext, goPrev, goToPage, paginatedData} = usePagination({data: results,  itemsPerPage: ItemsPerPage, initialPage: Number(page), setSearchParams})
    
    const sortingRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()

    const {  user: currentUser} = useAuth()

    useEffect(() => {

        setResults(prev => prev.map(comment => {
            return {...comment, show: false}
        })) 

    }, [currentPage])


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
        // Update state when URL params change
        setPage(searchParams.get("page"));
    }, [searchParams]); // <-- Triggers when URL params change

    useEffect(() => {

        fetch(`http://localhost:5110/user/postedComments/${currentUser.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
          
            return res.json()
        }).then(data => {
            setResults(data["$values"])
        }).catch((err) => {
            handleError(err, navigate)
        })

    }, [navigate, currentUser.id])


    function handleComponent(id: number){
        setResults(prev => prev.map(comment => {
            if (comment.id == id){
                return {...comment, show: !comment.show}
            }
            return comment
        }))
    }


      function likedHandler(isLiked: boolean, id: number){
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
                setResults((prevData: PostedCommentsInterface[]) => prevData.map(comment => {
                    if (comment.id == id){
                        return {...comment, likes: data, isLiked: !isLiked}
                    }
                    return comment
                }))
            }).catch(err => {
                handleError(err, navigate)
            })
        }
    
        function dislikeHandler(isDisliked: boolean, id: number){
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
                setResults((prevData: PostedCommentsInterface[]) => 
                    prevData.map(comment => {
                    if (comment.id == id){
                        return {...comment, dislikes: data, isDisliked: !isDisliked}
                    }
                    return comment 
                }))
            }).catch(err => {
                handleError(err, navigate)
            })
        }

    function deleteCommentHandler(commentId : number){

        fetch(`http://localhost:5110/comment/${commentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(() => {
            setResults((prevBlogData: PostedCommentsInterface[]) => prevBlogData.filter(comment => comment.id !== commentId))
            setDELETEWritten(false)
            setDeleteCommentConf(false)
        }).catch(err => {
            handleError(err, navigate)
        })

    }

    return (
        <section className="SearchComponent">
            {deleteCommentConf && 
                <DeleteConfirmation setDeleteButtonClicked={setDeleteCommentConf} deleteHandler={deleteCommentHandler} DELETEWritten={DELETEWritten} setDELETEWritten={setDELETEWritten} titleWord="Comment" sentence="Are you sure you want to delete this comment?" />
            }

            <SortingComponent setData={setResults} text="Comments" setShow={setShow} show={show} sortingRef={sortingRef} />

            {paginatedData.length > 0 && (
                <section className="SearchComponentResultsPostedComments">

                    {paginatedData.map((result) => {
                            return ( 
                                <div className="SearchComponentResultPostedComments" key={result.id}>
                                <article  className="SearchComponentResultBlog"  onClick={() => { setSearchParams({ page: String(currentPage)}); handleComponent(result.id)}}>

                                    <section className="BlogInfoSearchPostedComments">
                                        <h2 title={result.title}>{result.title}</h2>
                                    </section>

                                    <section className="BlogInfoDetailsSearch">
                                        <article>
                                            <article className="BlogLikesSearch" onClick={(e) => {e.stopPropagation(); likedHandler(result.isLiked, result.id)}}>
                                                <img src={result.isLiked ? "/likeClicked.png" : "/like.png"} alt="" />
                                                <p>{result.likes}</p>
                                            </article>
                                            <article className="BlogLikesSearch" onClick={(e) => {e.stopPropagation(); dislikeHandler(result.isDisliked, result.id)}}>
                                                <img src={result.isDisliked ? "/dislikeClicked.png" : "/dislike.png"} alt="" />
                                                <p>{result.dislikes}</p>
                                            </article>
 
                                            <span className="BlogDateSearch">{DateFormatter(result.createdAt)}</span>

                                            <article className="SeeBlogPostedComments">
                                                <p>See The Blog</p>
                                                <img onClick={(e) => {e.stopPropagation(); navigate(`/blog/${result.blogId}`)}} src="/PasswordEye.png" alt="" />
                                            </article>
                                        </article>

                                    </section>

                                </article>

                                    {(result.show  && result.content.length > 0) && (
                                        <div className={`PostedComponentResultBlogContent fade-in-up`}>
                                            <p title={stripHtml(result.content)}  dangerouslySetInnerHTML={{__html: result.content}}></p>
                                            <button onClick={() => {setDeleteCommentConf(true); window.scrollTo(50, 50)}}>Delete Comment</button>
                                        </div>
                                    )}
                                    {(result.show && result.content.length === 0) && (
                                        <div className={`NoContentPostedComponentsDiv fade-in-up`}>
                                            <h1 className="NoContentPostedComponents">There is no content in the comment!</h1>   
                                            <button onClick={() => {setDeleteCommentConf(true); window.scrollTo(50, 50)}}>Delete Comment</button>
                                        </div>
                                    )}
                                </div> 
                            )})}

                    {results.length > ItemsPerPage && (
                        <PaginationButtons itemsPerPage={ItemsPerPage} totalPages={totalPages} dataLength={results.length} canGoNext={CanGoNext} canGoPrev={CanGoPrev} currentPage={currentPage} goToPage={goToPage}  goNext={goNext} goPrev={goPrev}/>
                    )}

                </section>
            )}

        </ section>
    )

}