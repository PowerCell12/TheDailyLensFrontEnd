import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BlogInfo } from "../../interfaces/BlogInfo"
import handleError from "../../utils/handleError"
import DateFormatter from "../../utils/dateUtils"
import getHTMLElements from "../../utils/htmlUtils"
import { useAuth } from "../../contexts/useAuth"


export default function Home(){
    const navigate = useNavigate()
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [latestBlogs, setLatestBlogs] = useState<BlogInfo[]>([])
    const [topBlogs, setTopBlogs] = useState<BlogInfo[]>([])
    const [readAllClicked, setReadAllClicked] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)

    const { user } = useAuth();

    useEffect(() => {
        if (!user.email) return

        fetch(`http://localhost:5110/SMTP/isSubscribed/${user.email}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(async (res) => {
            if (!res.ok){
                throw Error("500 - Internal Server Error");
            }
            return res.json()
        }).then(data => {
            setIsSubscribed(data)
        }).catch(err => {
            handleError(err, navigate)
        })

    }, [navigate, user.email])

    useEffect(() => {
    
        searchRef.current?.addEventListener("keydown", (e) => {
            if (e.key == "Enter"){
                console.log(searchRef.current?.value)
                if (searchRef.current?.value == "") return
                navigate(`results?search_query=${searchRef.current?.value}&page=1`)
            }
        })

    }, [searchRef, navigate])

    useEffect(() => {

        fetch(`http://localhost:5110/blog/list?amount=4&type=new`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
        }).then(async (res) =>{
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
          
            return res.json()
        }).then(data => {
            setLatestBlogs(data["$values"].map((blog: BlogInfo) => {
                return {...blog, tags: blog.tags["$values"]}
            }))
        }).catch((err) => {
            handleError(err, navigate)
        }); 

        fetch("http://localhost:5110/blog/list?amount=4&type=top", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
        }).then(async (res) =>{
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
          
            return res.json()
        }).then(data => {
            setTopBlogs(data["$values"].map((blog: BlogInfo) => {
                return {...blog, tags: blog.tags["$values"]}
            }))
        }).catch((err) => {
            handleError(err, navigate)
        }); 


    }, [navigate])


    function handleEmailClick(){

        fetch(`http://localhost:5110/SMTP/updateSubscriptionStatus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({isSubscribed: !isSubscribed, email: user.email})
        }).then(async (res) => {
            if (!res.ok){
                throw Error("500 - Internal Server Error");
            }
        }).then(() => {
            setIsSubscribed(!isSubscribed)
        }).catch(err => {
            handleError(err, navigate)
        })

    }


    return (
        <>
            <main className="homeMain">
                <div className="searchBar">
                    <input ref={searchRef} type="text" placeholder="Search"/>
                    <img onClick={() => (searchRef.current?.value != "" && navigate(`results?search_query=${searchRef.current?.value}&page=1`))} src="/searchIcon.png" alt="" />
                </div>

                {latestBlogs.length > 0 ? (
                <section className="homeMainContent">
                    <article className="latest-headlines" >
                            <button className="MainLatestHeadlinesSeeMore" onClick={() => navigate(`/results?search_query=latest&page=1`)}>View all</button>
                            <button className="MainToptHeadlinesSeeMore" onClick={() => navigate(`/results?search_query=top&page=1`)}>View all</button>
                            <h1>Latest Headlines</h1>
                            
                            <section className="MainLatestHeadlines" onClick={() => navigate(`blog/${latestBlogs[0]?.id}`)}>

                                <img className="MainLatestHeadlinesImage" src={latestBlogs[0]?.thumbnail} alt="" />

                                <article className="MainLatestHeadlinesUserInfo">
                                    <section>
                                        <img className="MainLatestHeadlinesUserImage" src={(latestBlogs[0]?.userImageUrl && latestBlogs[0]?.userImageUrl !== "/PersonDefault.png") ? `http://localhost:5110/${latestBlogs[0]?.userImageUrl}` : "/PersonDefault.png"}/>

                                        <span>{latestBlogs[0]?.userName}</span>
                                    </section>

                                    <section>
                                        <span>{DateFormatter(latestBlogs[0]?.createdAt)}</span>

                                        <ul className="MainLatestHeadlinesTags">
                                            {latestBlogs[0]?.tags?.map((tag) => {
                                                return <li title={tag} key={tag}>{tag}</li> // HERE KEY IS THE TAG.ID
                                            })}
                                        </ul>
                                    </section>
                                </article>

                                <h2 className="MainLatestHeadlinesTitle">{latestBlogs[0]?.title}</h2>

                                {readAllClicked ? ( 
                                        <>
                                            <div className="MainLatestHeadlinesContent" dangerouslySetInnerHTML={{__html: getHTMLElements(latestBlogs[0]?.content, 3)}}></div> 
                                            <button className="MainLatestHeadlinesReadAll" onClick={(e) => {setReadAllClicked(!readAllClicked); e.stopPropagation()}}>Read Less</button> 
                                        </> )
                                    : (
                                        <>
                                            <div className="MainLatestHeadlinesContent" dangerouslySetInnerHTML={{__html: getHTMLElements(latestBlogs[0]?.content, 1)}}></div>
                                            <button className="MainLatestHeadlinesReadAll" onClick={(e) => {setReadAllClicked(!readAllClicked); e.stopPropagation()}}>Read More</button> 
                                        </>
                                     )}


                            </section>

                            <section className="OtherLastestHeadlines">
                                
                                {latestBlogs.length > 1 ? (
                                    <section className="OtherLatestHeadlineFirst" onClick={() => navigate(`blog/${latestBlogs[1]?.id}`)}>
                                        <section>
                                            <span>{DateFormatter(latestBlogs[1]?.createdAt)}</span>

                                            <ul className="MainLatestHeadlinesTags">
                                                    {latestBlogs[1]?.tags?.map((tag) => {
                                                        return <li title={tag} key={tag}>{tag}</li> // HERE KEY IS THE TAG.ID
                                                    })}
                                            </ul>
                                        </section>

                                        <h2>{latestBlogs[1]?.title}</h2>

                                        <img src={latestBlogs[1]?.thumbnail} alt="" />
                                    </section>
                                ) : (

                                    <section className="NoSecondLatest" onClick={() => {navigate("/createBlog")}}>
                                        <h2>Become a Contributor: Publish Now!</h2>

                                        <img src="BlogThumbnailDefault.jpg" alt="" />
                                    </section>

                                )}
                                
                                {latestBlogs.length > 2 && (
                                    <section className="OtherLatestHeadlineOthers2">
                                        {latestBlogs.slice(2).map((blog) => {
                                            return (
                                                <section key={blog.id} className="OtherLatestHeadlineOthers" onClick={() => navigate(`blog/${blog.id}`)}>
                                                    <section className="OtherLatestHeadlineUserInfo1">
                                                        <span>{DateFormatter(latestBlogs[1]?.createdAt)}</span>

                                                        <span title={blog.tags[0]} className="OtherLatestHeadlineTags">{blog.tags[0]}</span>
                                                    </section>

                                                    <h3>{blog.title}</h3>

                                                    <section className="OtherLatestHeadlineUserInfo2">
                                                        <img src={(blog.userImageUrl && blog.userImageUrl !== "/PersonDefault.png" ) ? `http://localhost:5110/${blog.userImageUrl}` : "/PersonDefault.png"} alt="" />

                                                        <span>{blog.userName}</span>
                                                    </section>

                                                </section>
                                            )
                                        })}
                                    </section>
                                )}
                            </section>

                            
                    </article>


                    <article className="most-popular-headlines">
                            <h3>Top Headlines</h3>
                            
                            {topBlogs.map((blog) => {
                                return (
                                    <section key={blog.id} className="OtherTopHeadline" onClick={() => navigate(`blog/${blog.id}`)}>
                                        <h3>{blog.title}</h3>

                                        <section>
                                            <span className="OtherTopHeadlineUserInfo">{DateFormatter(blog.createdAt)}</span>

                                            <span title={blog.tags[0]} className="OtherLatestHeadlineTags">{blog.tags[0]}</span>
                                        </section>
                                    </section>
                                )
                            })}


                            {user.id !== "0" ? (
                                isSubscribed == false ? (
                                    <section className="subscribe">
                                        <h4>Subscribe To Read More</h4>
                                        <p>Get notified when we publish something new.</p>
                                        <button onClick={() => handleEmailClick()}>Subscribe</button>
                                    </section>
                                ) : (
                                    <section className="subscribe">
                                        <h4>Subscribed</h4>
                                        <p>You're set to receive the latest updates from us.</p>
                                        <button onClick={() => handleEmailClick()}>Unsubscribe</button>
                                    </section>
                                )  
                            ) : (
                                <section className="subscribe">
                                    <h4>Subscribe To Read More</h4>
                                    <p>Get notified when we publish something new.</p>
                                    <button  disabled>Subscribe</button>
                                </section>
                            )}


                    </article>
                </section>
                ) : (
                    <div className="no-headlines">
                        <h1>Nothing to show just yet</h1>
                        <p>We don't have any headlines at the moment—check back soon!</p>
                    </div>
                )}
            </main>
        </>

    )

}