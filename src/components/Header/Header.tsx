import { Link, useNavigate } from "react-router-dom";
import '../../../public/css/all.css' ;



export default function Header(){
    const navigate = useNavigate();

    return (
        <div className="header">

            <section className="logoTitleSection">   
                <Link to="/"><img   src="/newsIcon.png" alt="" className="logo" /></Link>
                <Link to="/" className="title">The Daily Lens</Link>
            </section>

            <nav >

                <ul className="menu">
                    <li><Link to="/">Business</Link></li>
                    <li><Link to="/">Technology</Link></li>
                    <li><Link to="/">Weather</Link></li>
                    <li><Link to="/">Today</Link></li>
                </ul>   

            </nav>

            <section className="authButtons">
                <button className="loginButton" onClick={() => {navigate("/login")}}>Log In</button>
                <button className="registerButton" onClick={() => {navigate("/register")}}>Register</button>
                {/* <button className="logoutButton">Logout</button> */}
                {/* a user profile that when clicked opens a menu with the logoutbutto and settings */}
            </section>

        </ div>
    )



}