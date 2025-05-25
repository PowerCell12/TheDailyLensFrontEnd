import { Link, useNavigate, useLocation } from "react-router-dom";
import { FetchWithAuthorization } from "../../wrappers/fetchWrapper";
import { useEffect, useState } from "react";
import handleError from "../../utils/handleError";
import { useAuth } from "../../contexts/useAuth";



export default function Header() {
    const {user, setUser} = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (isOpen == false){
            return;
        }

        const closeDropDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(".sub-menu-wrap")   && !target.closest('#profilePicture') && isOpen == true  ){ 
                setIsOpen(false);
            }   
        }   
        document.addEventListener("click", closeDropDown) 

        return () => {document.removeEventListener("click", closeDropDown)}
    }, [isOpen]);
    

    useEffect(() => {
        setIsOpen(false);
    }, [location])




    function LogoutHandler(){
        
        FetchWithAuthorization("http://localhost:5110/auth/logout", "POST")
        .then(async response => {
            if (response.ok === false) {
                    const message = await response.json();
                    throw Error(`${response.status} - ${message.message}`);
            }

            setIsOpen(false);
            localStorage.clear();
            setUser({
                "name": "defaultName",
                "email": "",
                "accountType": "",
                "country": "",
                "fullName": "",
                "imageUrl": "/PersonDefault.png",
                "bio": "",
                "id": "0",
                "likedComments": [],
                "dislikedComments": [],
                "likedBlogs": []
            });
            navigate("/");
        })
        .catch((err) => {
            handleError(err, navigate)
        }); 
        

    }


    return (
        <div className="header">

            <section className="logoTitleSection">   
                <Link to="/"><img   src="/newsIcon.png" alt="" className="logo" /></Link>
                <Link to="/" className="title">The Daily Lens</Link>
            </section>

            <nav >

                <ul className="menu">
                    <li><Link to={`results?search_query=business&page=1`}>Business</Link></li>
                    <li><Link to={`results?search_query=technology&page=1`}>Technology</Link></li>
                    <li><Link to={`results?search_query=weather&page=1`}>Weather</Link></li>
                    <li><Link to={`results?search_query=politics&page=1`}>Politics</Link></li>
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
                            <img src={user.imageUrl} id="profilePicture" onClick={() => {setIsOpen(!isOpen);}} alt="" />

                            <div className="sub-menu-wrap" style={{ display: isOpen ? 'block' : 'none' }}>
                                <div className="sub-menu">
                                    <div className="user-info">
                                        <img src={user.imageUrl} id="profilePicture2" alt="" />

                                         
                                        <h3>{user.name !== user.email && user.name ? <span>{`Username: ${user.name}`}</span> : <Link to={"/profile/edit"}>Set up your profile!</Link>}</h3>
                                    </div>
                                    <hr />

                                    <Link to={`/profile/${user.name}`} className="sub-menu-link">
                                        <img src="/Settings.png" alt="" />
                                        <p>My Profile</p>
                                        <span>&gt;</span>
                                    </Link>



                                    <Link to={`/${user.name}/postedBlogs?page=1`} className="sub-menu-link">
                                        <img src="/Blogs.png" alt="" />
                                        <p>See Your Posted blogs</p>
                                        <span>&gt;</span>
                                    </Link>

                                    <Link to={`/${user.name}/postedComments?page=1`} className="sub-menu-link">
                                        <img src="/comments.png" alt="" />
                                        <p>See Your Posted Comments</p>
                                        <span>&gt;</span>
                                    </Link>


                                    <Link to="/createBlog" className="sub-menu-link">
                                        <img src="/CreateBlog.png" alt="" />
                                        <p>Create a new blog</p>
                                        <span>&gt;</span>
                                    </Link>



                                    <Link to={`/${user.name}/likedBlogs?page=1`} className="sub-menu-link">
                                        <img src="/Liked.png" alt="" />
                                        <p>See Your Liked blogs</p>
                                        <span>&gt;</span>
                                    </Link>

                                </div>
                            </div>

                            <button className="logoutButton" onClick={LogoutHandler}>Logout</button>
                        </> )
                }
            </section>

        </ div>
    )



}