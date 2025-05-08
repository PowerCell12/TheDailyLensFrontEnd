import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import handleError from "../../utils/handleError";
import { SearchUser } from "../../interfaces/SearchUser";
import { SearchBlog } from "../../interfaces/SearchBlog";
import DateFormatter from "../../utils/dateUtils";


export default function SearchComponent(){
    const [searchParams, setSearchParams] = useSearchParams();
    const search_query1 = searchParams.get("search_query")
    const [search, setSearch] = useState(search_query1);
    const [results, setResults] = useState<(SearchUser | SearchBlog)[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(search);

        if (search == null || search == undefined || search == "") {
            return
        }

        fetch(`http://localhost:5110/blog/search/${search}`, {
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
            console.log([...data.users["$values"], ...data.blogs["$values"]])
            setResults([...data.users["$values"], ...data.blogs["$values"]]) // EVERY OBJECT IS A BLOG OR A USER

        }).catch((err) => {
            handleError(err, navigate)
        })

    }, [search, navigate])

    return (
        <section className="SearchComponent">
            <div className="searchBar searchBar2">
                <input type="text" placeholder="Search" value={search || ""} onChange={(e) => setSearch(e.target.value)}/>
                <img src="/searchIcon.png" alt="" />
            </div>
        

            {results.length == 0 && (
                <h1 className="SearchComponentNoResults">No Results Found for "{search}. Try a different keyword."</h1>
            )}

            {results.length > 0 && (
                <section className="SearchComponentResults">

                    {results.map((result) => {
                        if ('email' in result){
                            return (
                                <article className="SearchComponentResultUser" key={result.id}>

                                    {result.image == "/PersonDefault.png" ? <img src="/BlogThumbnailDefault.png" alt="" /> : <img src={`http://localhost:5110/${result.image}`} alt="" />}
                                    <div>
                                        <h2>{result.userName}</h2>
                                        <p>{result.email}</p>
                                    </div>

                                </article>
                            )
                        }
                        else{
                            return (
                                <article className="SearchComponentResultBlog" key={result.id} onClick={() => { if (search) setSearchParams({ search_query: search}); navigate(`/blog/${result.id}`) }}>

                                    {result.thumbnail == "/BlogThumbnailDefault.jpg" ? <img src="/BlogThumbnailDefault.jpg" alt="" /> : <img src={result.thumbnail} alt="" />}
                                    <section className="BlogInfoSearch">
                                        <h2>{result.title}</h2>
                                        <article className="BlogAuthorSearch">
                                            {result.userImageUrl == "/PersonDefault.png" ? <img src="/BlogThumbnailDefault.png" alt="" /> : <img src={`http://localhost:5110/${result.userImageUrl}`} alt="" />}
                                            <p>{result.userName}</p>
                                        </article>
                                    </section>

                                    <section className="BlogInfoDetailsSearch">
                                        <article>
                                            <article className="BlogLikesSearch">
                                                <img src="/like.png" alt="" />
                                                <p>{result.likes}</p>
                                            </article>
                                            <span className="BlogDateSearch">{DateFormatter(result.createdAt)}</span>
                                        </article>

                                        {result.tags["$values"].length > 0 && (
                                            <ul className="BlogTagsList">
                                                {result.tags["$values"].map((tag: string, index: number) => {
                                                    return(
                                                        <li key={index} className={"BlogTags"} title={tag}>{tag}</li>
                                                    )
                                                })}
                                            </ul>
                                        )}
                                    </section>

                                </article>
                            )
                        }
                    })}
                
                </section>
            )}  
        
        </ section>
    )
}