import { HeaderProps } from "../../interfaces/HeaderProps"
import { useRef, useState } from "react"
import useUploadingImage from "../../hooks/UploadImage"
import { Link, useNavigate } from "react-router-dom"



export default function ProfilePageComponent({user, setUser} : HeaderProps){
    const navigate = useNavigate()
    const ImageFileref = useRef<HTMLInputElement>(null)
    const DeleteWriteRef = useRef<HTMLInputElement>(null)
    const [deleteButtonClicked, setDeleteButtonClicked] = useState(false)
    const [DELETEWritten, setDELETEWritten] = useState(false)
    useUploadingImage(ImageFileref, {user, setUser})


    function imgHandler() {
        if (ImageFileref.current == null || ImageFileref.current == undefined) return

        ImageFileref.current.click()
    }


    function DeleteAccount() {
        console.log(DeleteWriteRef.current?.value !== "DELETE")
        if (DeleteWriteRef.current?.value.trim() != "DELETE"){
            // console.log("first")

            setDELETEWritten(true)
        }
        else{
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
                const status = err.message.split(" - ")[0]
                const statusText = err.message.split(" - ")[1]
                navigate("/error", {
                    state: {
                        code: status || 500,
                        message: statusText || "Network Error"
                    }  
                })
            })

        }
        
        

    }

    return (
        <section className="ProfilePageComponent">
            {deleteButtonClicked && 
                <div className="EditProfileDeleteAccountContainer" onClick={() => {setDeleteButtonClicked(false); setDELETEWritten(false)}}>
                    <div className="EditProfileDeleteAccount" onClick={(event) => {event.stopPropagation()}}>
                        <i onClick={() => {setDeleteButtonClicked(false); setDELETEWritten(false);}} className="fa-solid fa-xmark" id="EditProfileDeleteAccountClose"></i>
                        <h1>Delete Account</h1>
                        <p>Deleting your account will remove all of your information! This action cannot be undone!</p>
                        <span>To confirm this, type "DELETE"</span>
                        <section>
                            <input  ref={DeleteWriteRef} type="text" />
                            <button type="button" onClick={() => {DeleteAccount()}}>Delete Account</button>
                            {DELETEWritten && <p className="EditProfileDeleteAccountError">Please type "DELETE" to confirm</p>}
                        </section>
                    </div>
                </div>
            }

            <aside className="ProfilePageAccountManagment">
                <h2>Account Managment</h2>

                <img onClick={() => {imgHandler()}}   src={user.imageUrl == undefined ? "/PersonDefault.png" : user.imageUrl} className={"ProfilePageComponentImage"} alt="" />

                <input ref={ImageFileref} type="file" className="ProfilePageComponentImageFile" />

                <p className="ProfilePageComponentGreeting">Hello, {user.name}!</p>
                <form className="ProfilePageComponentForm" action="" method="post">
                    <label className="ProfilePageComponentLabelPassword">New Password</label>
                    <input type="password" placeholder={"*".repeat(8)} className="ProfilePageComponentPassword"/>
            
                    <button type="submit" className="ProfilePageComponentButton">Change Password</button>
                </form>
            
            
            </aside>


            <main >

                <h2 className="ProfilePageh2">Profile Information</h2>

                <section className="ProfilePageProfileInformation">
                    <article>
                        <h5>Username</h5>
                        <p>{user.name == user.email ? "N/A" : user.name}</p>    
                    </article>

                    <article>
                        <h5>Full Name</h5>
                        <p>{user.fullName == null ? "N/A" : user.fullName}</p>
                    </article>

                </section>

                <section className="ProfilePageProfileInformation">
                    <article>
                        <h5>Account Type</h5>
                        <p>{user.accountType ? user.accountType : "N/A"}</p>
                    </article>

                    <article>
                        <h5>Country</h5>
                        <p>{user.country == null ? "N/A" : user.country}</p>
                    </article>

                </section>

                <h3 className="ProfilePageh3">Contact Info</h3>
                <h5 className="ProfilePageh5">Email</h5>
                <p className="ProfilePagep ProfilePageEmail">{user.email}</p>


                <h3 className="ProfilePageh3">About the User</h3>

                <h5 className="ProfilePageh5">Bio</h5>
                <p className="ProfilePagep ProfilePageBio">{user.bio == null ? "N/A" : user.bio}</p>

            </main>

            <aside className="ProfilePageAccountSettings">
                <h2>Account Settings</h2>
                <section className="ProfilePageAccountSettingsSection">
                    <Link id="ProfilePageLinkEdit" to="/profile/edit" className="ProfilePageLink">Edit Profile</Link>
                    <button id="ProfilePageLinkDelete" onClick={() => {setDeleteButtonClicked(true)}} className="ProfilePageLink">Delete Account</button>
                </section>
            </aside>


        </section>
    )

}