import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuthorization} from "../../wrappers/fetchWrapper";



export default function Header(){
    const navigate = useNavigate();

    function LogoutHandler(){
        const err = new Error('Logout failed');
        

        fetchWithAuthorization("http://localhost:5110/auth/logout", "POST")
        .then(response => {
            if (!response?.ok) {
                throw err;
            }

            localStorage.clear();
            navigate("/");
        })
        .catch((err) => {
            console.log(err);
            throw err;
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