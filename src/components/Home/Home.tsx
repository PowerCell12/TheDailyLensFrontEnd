import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BlogInfo } from "../../interfaces/BlogInfo"
import handleError from "../../utils/handleError"
import DateFormatter from "../../utils/dateUtils"
import getHTMLElements from "../../utils/htmlUtils"


export default function Home(){
    const navigate = useNavigate()
    const [latestBlogs, setLatestBlogs] = useState<BlogInfo[]>([])
    const [topBlogs, setTopBlogs] = useState<BlogInfo[]>([])
    const [readAllClicked, setReadAllClicked] = useState(false)

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
            setLatestBlogs(data["$values"])
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
            setTopBlogs(data["$values"])
        }).catch((err) => {
            handleError(err, navigate)
        }); 


    }, [navigate])


    const dummyTags = ["Breaking", "World", "Opinion", "Culture"];



    return (
        <>
            <main className="homeMain">
                <div className="searchBar">
                    <input type="text" placeholder="Search"/>
                    <img src="/searchIcon.png" alt="" />
                </div>

                <section className="homeMainContent">
                    <article className="latest-headlines">
                            <button className="MainLatestHeadlinesSeeMore">View all</button>
                            <button className="MainToptHeadlinesSeeMore">View all</button>
                            <h1>Latest Headlines</h1>
                            
                            <section className="MainLatestHeadlines">

                                <img className="MainLatestHeadlinesImage" src={latestBlogs[0]?.thumbnail} alt="" />

                                <article className="MainLatestHeadlinesUserInfo">
                                    <section>
                                        <img className="MainLatestHeadlinesUserImage" src={latestBlogs[0]?.userImageUrl ? `http://localhost:5110/${latestBlogs[0]?.userImageUrl}` : "/PersonDefault.png"}/>

                                        <span>{latestBlogs[0]?.userName}</span>
                                    </section>

                                    <section>
                                        <span>{DateFormatter(latestBlogs[0]?.createdAt)}</span>

                                        <ul className="MainLatestHeadlinesTags">
                                            {dummyTags.map((tag) => {
                                                return <li key={tag}>{tag}</li> // HERE KEY IS THE TAG.ID
                                            })}
                                        </ul>
                                    </section>
                                </article>

                                <h2 className="MainLatestHeadlinesTitle">{latestBlogs[0]?.title}</h2>

                                {readAllClicked ? ( 
                                        <>
                                            <div className="MainLatestHeadlinesContent" dangerouslySetInnerHTML={{__html: getHTMLElements(latestBlogs[0]?.content, 9)}}></div> 
                                            <button className="MainLatestHeadlinesReadAll" onClick={() => {setReadAllClicked(!readAllClicked)}}>Read Less</button> 
                                        </> )
                                    : (
                                        <>
                                            <div className="MainLatestHeadlinesContent" dangerouslySetInnerHTML={{__html: getHTMLElements(latestBlogs[0]?.content, 3)}}></div>
                                            <button className="MainLatestHeadlinesReadAll" onClick={() => {setReadAllClicked(!readAllClicked)}}>Read More</button> 
                                        </>
                                     )}


                            </section>

                            <section className="OtherLastestHeadlines">
                                    
                                <section className="OtherLatestHeadlineFirst" onClick={() => navigate(`blog/${latestBlogs[1]?.id}`)}>
                                    <section>
                                        <span>{DateFormatter(latestBlogs[1]?.createdAt)}</span>

                                        <ul className="MainLatestHeadlinesTags">
                                                {dummyTags.map((tag) => {
                                                    return <li key={tag}>{tag}</li> // HERE KEY IS THE TAG.ID
                                                })}
                                        </ul>
                                    </section>

                                    <h2>{latestBlogs[1]?.title}</h2>

                                    <img src={latestBlogs[1]?.thumbnail} alt="" />
                                </section>

                                <section className="OtherLatestHeadlineOthers2">
                                    {latestBlogs.slice(2).map((blog) => {
                                        return (
                                            <section key={blog.id} className="OtherLatestHeadlineOthers" onClick={() => navigate(`blog/${blog.id}`)}>
                                                <section className="OtherLatestHeadlineUserInfo1">
                                                    <span>{DateFormatter(latestBlogs[1]?.createdAt)}</span>

                                                    <span className="OtherLatestHeadlineTags">{dummyTags[0]}</span>
                                                </section>

                                                <h3>{blog.title}</h3>

                                                <section className="OtherLatestHeadlineUserInfo2">
                                                    <img src={blog.userImageUrl ? `http://localhost:5110/${blog.userImageUrl}` : "/PersonDefault.png"} alt="" />

                                                    <span>{blog.userName}</span>
                                                </section>

                                            </section>
                                        )
                                    })}
                                </section>

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

                                            <span  className="OtherLatestHeadlineTags">{dummyTags[0]}</span>
                                        </section>
                                    </section>
                                )
                            })}

                            <section className="subscribe">
                                <h4>Subscribe To Read More</h4>
                                <p>Get notified when we publish something new</p>
                                <button>Subscribe</button>
                            </section>

                    </article>
                </section>
            </main>
        </>

    )

}