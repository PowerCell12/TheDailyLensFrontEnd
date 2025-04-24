import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BlogInfo } from "../../interfaces/BlogInfo"


export default function Home(){
    const navigate = useNavigate()
    const [latestBlogs, setLatestBlogs] = useState<BlogInfo[]>([])
    const [topBlogs, setTopBlogs] = useState<BlogInfo[]>([])
    const [readAllClicked, setReadAllClicked] = useState(false)

    useEffect(() => {

        fetch(`http://localhost:5110/blog?amount=4&type=new`, {
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
            setLatestBlogs(data)
        }).catch((err) => {
            
            const status = err.message.split(" - ")[0]
            const statusText = err.message.split(" - ")[1]
            navigate("/error", {
                state: {
                    code: status || 500,
                    message: statusText || "Network Error"
                }  
            })
        }); 

        fetch("http://localhost:5110/blog?amount=4&type=top", {
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
            setTopBlogs(data)
            console.log(data)
        }).catch((err) => {
            
            const status = err.message.split(" - ")[0]
            const statusText = err.message.split(" - ")[1]
            navigate("/error", {
                state: {
                    code: status || 500,
                    message: statusText || "Network Error"
                }  
            })
        }); 


    }, [navigate])


    function DateFormatter(isoString: string){
        const d = new Date(isoString);
        const yy = String(d.getFullYear() % 100).padStart(2, "0");     
        const mm = String(d.getMonth() + 1).padStart(2, "0");           
        const hh = String(d.getHours()).padStart(2, "0");               
        return `${d.getDate()}.${mm}.${yy} ${hh}:00`;
    }

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
                                        <img className="MainLatestHeadlinesUserImage" src={`http://localhost:5110/${latestBlogs[0]?.userImageUrl}`}/>

                                        <span>{latestBlogs[0]?.userName}</span>
                                    </section>

                                    <section>
                                        <span>{DateFormatter(latestBlogs[0]?.createdAt)}</span>

                                        <ul className="MainLatestHeadlinesTags">
                                            {dummyTags.map((tag, index) => {
                                                return <li key={index}>{tag}</li>
                                            })}
                                        </ul>
                                    </section>
                                </article>

                                <h2 className="MainLatestHeadlinesTitle">{latestBlogs[0]?.title}</h2>

                                <div className="MainLatestHeadlinesContent" dangerouslySetInnerHTML={{__html: latestBlogs[0]?.content}}></div>
                                

                                <button className="MainLatestHeadlinesReadAll">Read All</button>

                            </section>

                            <section className="OtherLastestHeadlines">
                                    
                                <section className="OtherLatestHeadlineFirst">
                                    <section>
                                        <span>{DateFormatter(latestBlogs[1]?.createdAt)}</span>

                                        <ul className="MainLatestHeadlinesTags">
                                                {dummyTags.map((tag, index) => {
                                                    return <li key={index}>{tag}</li>
                                                })}
                                        </ul>
                                    </section>

                                    <h2>{latestBlogs[1]?.title}</h2>

                                    <img src={latestBlogs[1]?.thumbnail} alt="" />
                                </section>

                                <section className="OtherLatestHeadlineOthers2">
                                    {latestBlogs.slice(2).map((blog) => {
                                        return (
                                            <section className="OtherLatestHeadlineOthers">
                                                <section className="OtherLatestHeadlineUserInfo1">
                                                    <span>{DateFormatter(latestBlogs[1]?.createdAt)}</span>

                                                    <span className="OtherLatestHeadlineTags">{dummyTags[0]}</span>
                                                </section>

                                                <h3>{blog.title}</h3>

                                                <section className="OtherLatestHeadlineUserInfo2">
                                                    <img src={`http://localhost:5110/${blog.userImageUrl}`} alt="" />

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
                                    <section className="OtherTopHeadline">
                                        <h3>{blog.title}</h3>

                                        <section>
                                            <span className="OtherTopHeadlineUserInfo">{DateFormatter(blog.createdAt)}</span>

                                            <span  className="OtherLatestHeadlineTags">{dummyTags[0]}</span>
                                        </section>
                                    </section>
                                )
                            })}

                            <section>
                                <h4>SUBSCRIBE TO READ MORE</h4>
                                <p>Get notified when we publish something new</p>
                                <button>Subscribe</button>
                            </section>

                    </article>
                </section>
            </main>
        </>

    )

}