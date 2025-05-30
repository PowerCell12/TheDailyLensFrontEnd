import { Link } from "react-router-dom";
import '../../../public/css/all.css' ;
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function Footer(){
    const date = new Date()

    return (
        <div className="FooterTopDiv">

            <section className="footerTop">

                <h2>The Daily Lens</h2>
                

                <ul className="footerLinks">
                    <li>Business</li>
                    <li><Link to={`results?search_query=personal finance&page=1`}>Personal Finance</Link></li>
                    <li><Link to={`results?search_query=budgeting&page=1`}>Budgeting</Link></li>
                    <li><Link to={`results?search_query=market news&page=1`}>Market News</Link></li>
                    <li><Link to={`results?search_query=startups&page=1`}>Startups</Link></li>
                    <li><Link to={`results?search_query=real estate&page=1`}>Real Estate</Link></li>
                </ul>

                <ul className="footerLinks">
                    <li>Technology</li>
                    <li><Link  to={`results?search_query=gadgets&page=1`}>Gadgets</Link></li>
                    <li><Link  to={`results?search_query=artificial intelligence&page=1`}>AI</Link></li>
                    <li><Link  to={`results?search_query=internet&page=1`}>Internet</Link></li>
                    <li><Link  to={`results?search_query=security&page=1`}>Security</Link></li>
                    <li><Link  to={`results?search_query=software&page=1`}>Software</Link></li>
                </ul>


                <ul className="footerLinks last">
                    <li>Weather</li>
                    <li><Link to={`results?search_query=todays weather&page=1`}>Today's Weather</Link></li>
                    <li><Link to={`results?search_query=climate&page=1`}>Climate</Link></li>
                    <li><Link to={`results?search_query=environment&page=1`}>Environment</Link></li>
                </ul>

            </section>

            <hr />


            <section className="footerBottom">
                <ul className="footerFinalLinks">
                    <li>The Daily Lens Inc. © {date.getFullYear()}</li>
                    <li><Link to="/">Privacy and Terms</Link></li>
                </ul>

                <article className="socials">
                    <a href="https://x.com/nytimes" target="_blank"><i className="fa-brands fa-twitter" ></i></a>
                    <a href="https://www.facebook.com/nytimes/" target="_blank"><i className="fa-brands fa-facebook"></i></a>
                    <a href="https://www.youtube.com/@nytimes" target="_blank"><i className="fa-brands fa-youtube"></i></a>
                    <a href="https://www.linkedin.com/company/the-new-york-times" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
                    <a href="https://github.com/nytimes" target="_blank"><i className="fa-brands fa-github"></i></a>
                </article>
            </section>

        </ div>
    )

}