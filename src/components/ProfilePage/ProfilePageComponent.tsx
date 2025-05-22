import { HeaderProps } from "../../interfaces/HeaderProps"
import { useEffect, useRef, useState } from "react"
import useUploadingImage from "../../hooks/UploadImage"
import { Link, useNavigate, useParams } from "react-router-dom"
import handleError from "../../utils/handleError"
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation"
import { defaultUser } from "../../utils/AuthUtils"
import { useAuth } from "../../contexts/useAuth"



export default function ProfilePageComponent(){
    const { user: currentUser} = useAuth();
    const navigate = useNavigate()
    const [user, setUser] = useState<HeaderProps["user"]>(defaultUser)
    const ImageFileref = useRef<HTMLInputElement>(null)
    const [deleteButtonClicked, setDeleteButtonClicked] = useState(false)
    const [DELETEWritten, setDELETEWritten] = useState(false)
    useUploadingImage(ImageFileref, {user, setUser})

    const { username } = useParams();

    useEffect(() => {

        fetch(`http://localhost:5110/user/title/${username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then((res) => {
            console.log(res)
            if (res.imageUrl == null) res.imageUrl = "/PersonDefault.png"
            setUser({...res, imageUrl: res.imageUrl == "/PersonDefault.png" ? "/PersonDefault.png" : `http://localhost:5110/${res.imageUrl}`})
        }).catch(err => {
            handleError(err, navigate)
        })


    }, [navigate, username])

    function imgHandler() {
        if (ImageFileref.current == null || ImageFileref.current == undefined) return

        ImageFileref.current.click()
    }


    function DeleteAccount() {
            fetch("http://localhost:5110/user/deleteProfile", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                }}
            ).then(async (res) => {
                if (!res.ok){
                    const message =  await res.json()
                    throw Error(`${res.status} - ${message.message}`);
                }

                localStorage.removeItem("authToken")
                navigate("/")
            }).catch(err => {
                handleError(err, navigate)
            })
    }

    function DeleteProfilePicHandler(){

        if (user.imageUrl == "/PersonDefault.png") return


        fetch("http://localhost:5110/user/resetProfileImage", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then (async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }

            setUser({...user, imageUrl: "/PersonDefault.png"})
        }).catch(err => {
            handleError(err, navigate)
        })

    }

    return (
        <section className="ProfilePageComponent">
            
            {user.id == currentUser.id && <img src="/deleteProfilePic.png" alt="" id="DeleteProfilePicProfile" onClick={() => {DeleteProfilePicHandler()}}/> }
            {deleteButtonClicked && 
                <DeleteConfirmation setDeleteButtonClicked={setDeleteButtonClicked} deleteHandler={DeleteAccount} DELETEWritten={DELETEWritten} setDELETEWritten={setDELETEWritten} />
            }

            <aside className={user.id == currentUser.id ? "ProfilePageAccountManagment" : "ProfilePageAccountManagmentReadOnly"}>
                {user.id == currentUser.id && <h2>My Account</h2> }

                {user.id !== currentUser.id && <h2>{user.name}'s Account</h2> }
                <img onClick={() => {if (user.id == currentUser.id) imgHandler()}}   src={user.imageUrl} className={user.id == currentUser.id ? "ProfilePageComponentImage" : "ProfilePageComponentImageReadOnly"} alt="" />

                {user.id !== currentUser.id && <p className="ProfilePageComponentGreetingReadOnly">{user.name}s' profile overview and activity.</p>}

                <input ref={ImageFileref} type="file" className="ProfilePageComponentImageFile" />

                {user.id === currentUser.id && <p className="ProfilePageComponentGreeting">Hello, {user.name || user.email}!</p> }

                {user.id == currentUser.id &&
                    <form className="ProfilePageComponentForm" action="" method="post">
                        <label className="ProfilePageComponentLabelPassword">New Password</label>
                        <input type="password" placeholder={"*".repeat(8)} className="ProfilePageComponentPassword"/>
                
                        <button type="submit" className="ProfilePageComponentButton">Change Password</button>
                    </form>
                }
            
            
            </aside>


            <main >

                <h2 className="ProfilePageh2">Profile Information</h2>

                <section className="ProfilePageProfileInformation">
                    <article>
                        <h5>Username</h5>
                        <p>{user.name !== user.email && user.name ? user.name : "N/A"}</p>    
                    </article>

                    <article>
                        <h5>Full Name</h5>
                        <p>{user.fullName || "N/A"}</p>
                    </article>

                </section>

                <section className="ProfilePageProfileInformation">
                    <article>
                        <h5>Account Type</h5>
                        <p>{user.accountType || "Basic User"}</p>
                    </article>

                    <article>
                        <h5>Country</h5>
                        <p>{user.country || "N/A"}</p>
                    </article>

                </section>

                <h3 className="ProfilePageh3">Contact Info</h3>
                <h5 className="ProfilePageh5">Email</h5>
                <p className="ProfilePagep ProfilePageEmail">{user.email}</p>


                <h3 className="ProfilePageh3">About the User</h3>

                <h5 className="ProfilePageh5">Bio</h5>
                <p className="ProfilePagep ProfilePageBio">{user.bio || "N/A"}</p>

            </main>

            {currentUser.id == user.id &&             
                <aside className="ProfilePageAccountSettings">
                    <h2>Account Settings</h2>
                    <section className="ProfilePageAccountSettingsSection">
                        <Link id="ProfilePageLinkEdit" to="/profile/edit" className="ProfilePageLink">Edit Profile</Link>
                        <button id="ProfilePageLinkDelete" onClick={() => {setDeleteButtonClicked(true)}} className="ProfilePageLink">Delete Account</button>
                    </section>
                </aside>
            }

            {currentUser.id !== user.id && 
                <aside className="ProfilePageAccountSettingsReadOnly"> 
                    <h2>See More About {user.name}</h2>
                    <section className="ProfilePageAccountSettingsSectionReadOnly">
                        <Link to={`/${user.name}/postedBlogs?page=1`} className="ProfilePageLinkReadOnly">See Posted Blogs</Link>
                        <Link to={`/${user.name}/likedBlogs?page=1`} className="ProfilePageLinkReadOnly">See Liked Blogs</Link>
                    </section>
                </aside>
            }

        </section>
    )

}