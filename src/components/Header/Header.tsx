import { Link, useNavigate, useLocation } from "react-router-dom";
import { FetchWithAuthorization } from "../../wrappers/fetchWrapper";
import { useEffect, useState } from "react";
import { HeaderProps } from "../../interfaces/HeaderProps";



export default function Header({ user, setUser }: HeaderProps) {
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
            setUser({"name": "defaultName", "email": "", "accountType": "", "country": "", "fullName": "", "imageUrl": "", "bio": ""});
            navigate("/");
        })
        .catch((err) => {
            
            const status = err.message.split(" - ")[0]
            const statusText = err.message.split(" - ")[1]
            navigate("/error", {
                state: {
                    code: status || 500,
                    message: statusText || "Network Error"
                }  
            })
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

                            <img src={user.imageUrl == undefined ? "/PersonDefault.png" : user.imageUrl} id="profilePicture" onClick={() => {setIsOpen(!isOpen);}} alt="" />

                            <div className="sub-menu-wrap" style={{ display: isOpen ? 'block' : 'none' }}>
                                <div className="sub-menu">
                                    <div className="user-info">
                                        <img src={user.imageUrl == undefined ? "/PersonDefault.png" : user.imageUrl} id="profilePicture2" alt="" />

                                         
                                        <h3>{user.name !== user.email ? <span>{`Username: ${user.name}`}</span> : <Link to={"/profile/edit"}>Set up your profile!</Link>}</h3>
                                    </div>
                                    <hr />

                                    <Link to="/profile" className="sub-menu-link">
                                        <img src="/Settings.png" alt="" />
                                        <p>My Profile</p>
                                        <span>&gt;</span>
                                    </Link>



                                    <Link to="/relatedBlogs" className="sub-menu-link">
                                        <img src="/Blogs.png" alt="" />
                                        <p>See Your Posted blogs</p>
                                        <span>&gt;</span>
                                    </Link>

                                    <Link to="/createBlog" className="sub-menu-link">
                                        <img src="/CreateBlog.png" alt="" />
                                        <p>Create a new blog</p>
                                        <span>&gt;</span>
                                    </Link>



                                    <Link to="/LikedBlogs" className="sub-menu-link">
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