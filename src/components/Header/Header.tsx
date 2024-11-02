import { Link, useNavigate } from "react-router-dom";
import { Logout } from "../../services/AuthService";



export default function Header(){
    const navigate = useNavigate();

    function LogoutHandler(){

        Logout(localStorage.getItem("authToken") || "")
        .then(response => {
            if (!response.ok) {
                throw new Error('Logout failed');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            navigate("/");
        })
        .catch(err => {
            console.error('Error:', err);
        })

    }

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
                {!localStorage.getItem("authToken")  ? (
                    <>
                         <button className="loginButton" onClick={() => {navigate("/login")}}>Log In</button>
                         <button className="registerButton" onClick={() => {navigate("/register")}}>Register</button> 
                    </>
                    )  : (
                        <>
                        <img src="/PersonDefault.png" id="profilePicture" alt="" />
                        <button className="logoutButton" onClick={LogoutHandler}>Logout</button>
                        </> )
                }
            </section>

        </ div>
    )



}