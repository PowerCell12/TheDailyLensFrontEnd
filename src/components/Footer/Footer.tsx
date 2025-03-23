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
                    <li><Link to="/">Personal Finance</Link></li>
                    <li><Link to="/">Budgeting</Link></li>
                    <li><Link to="/">Market News</Link></li>
                    <li><Link to="/">Startups</Link></li>
                    <li><Link to="/">Real Estate</Link></li>
                </ul>

                <ul className="footerLinks">
                    <li>Technology</li>
                    <li><Link to="/">Gadgets</Link></li>
                    <li><Link to="/">AI</Link></li>
                    <li><Link to="/">Internet</Link></li>
                    <li><Link to="/">Security</Link></li>
                    <li><Link to="/">Software</Link></li>
                </ul>


                <ul className="footerLinks last">
                    <li>Weather</li>
                    <li><Link to="/">Today's Weather</Link></li>
                    <li><Link to="/">Climate</Link></li>
                    <li><Link to="/">Environment</Link></li>
                </ul>

            </section>

            <hr />


            <section className="footerBottom">
                <ul className="footerFinalLinks">
                    <li>The Daily Lens Inc. © {date.getFullYear()}</li>
                    <li><Link to="/">Privacy</Link></li>
                    <li><Link to="/">Terms</Link></li>
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