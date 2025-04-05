

export default function Home(){


    return (
        <>
            <article className="latest-headlines">
                    <img className="ProfilePageDetailsActive" src="/green-circle.png" alt="" />
                    <h3>Latest Headlines</h3>
                    <ul>
                        <li><a href="/article/001">Breaking News: Market Shifts Significantly</a></li>
                        <li><a href="/article/002">Local Community Celebrates Annual Festival</a></li>
                        <li><a href="/article/003">Sports: Underdog Team Claims Victory</a></li>
                    </ul>
            </article>


            <article className="most-popular-headlines">
                    <img className="ProfilePageDetailsActive" src="/green-circle.png" alt="" />
                    <h3>Top Headlines</h3>
                    <ul>
                        <li><a href="/article/001">Breaking News: Market Shifts Significantly</a></li>
                        <li><a href="/article/002">Local Community Celebrates Annual Festival</a></li>
                        <li><a href="/article/003">Sports: Underdog Team Claims Victory</a></li>
                    </ul>
            </article>
        </>

    )

}