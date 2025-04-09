import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function EditProfile({user, setUser}){
    const navigate = useNavigate()
    const [InputDict, setInputDict] = useState({
        username: user.name,
        fullName: user.fullName,
        country: user.country,
        email: user.email,
        bio: user.bio
    })
    
    function SubmitEditProfile(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()

        console.log("first")

    }

    return (

        <section className="EditProfileComponent">
            <img src="/EditPageWallpaper.jpg" alt="" className="EditProfileImage"/>
            <img className="EditProfileImageAccount" src={user.imageUrl == undefined ? "/PersonDefault.png" : user.imageUrl} alt="" />
            
            <main>
                <h1 className="EditProfileTitle">Edit Profile</h1>


                <form className="EditProfileForm" action="POST" onSubmit={(event) => {SubmitEditProfile(event)}}>

                    <section className="EditProfileFormSection">
                        <article>
                            <label className="EditProfileUsername" htmlFor="Username">Username</label>
                            <input type="text" id="Username" placeholder="example_username" value={InputDict.username} onChange={((event) => {setInputDict({...InputDict, username: event?.target.value})})} />
                        </article>

                        <article>
                            <label className="EditProfileFullName" htmlFor="fullName">Full Name</label>
                            <input  type="text" id="fullName" placeholder="John Doe" value={InputDict.fullName} />
                        </article>
                    </section>

                    <section className="EditProfileFormSection">
                        <article>
                            <label className="EditProfileCountry" htmlFor="country">Country</label>
                            <input type="text" id="country" placeholder="United States" value={InputDict.country} />
                        </article>

                        <article>
                            <label className="EditProfileEmail" htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="example_email" defaultValue={user.email == undefined ? "example@domain.com" : user.email} />
                        </article>
                    </section>

                    <article className="EditProfileFormBioDiv">
                        <label className="EditProfileBio" htmlFor="bio">Bio</label>
                        <textarea id="bio" placeholder="Write your bio here" value={InputDict.bio}></textarea>
                    </article>

                    <article className="EditProfileFormButtons">
                        <button className="EditProfileCancel" type="button" onClick={() => {navigate("/profile")}}>Cancel</button>

                        <button className="EditProfileSave" type="submit">Save Changes</button>
                    </article>

                </form>
            </main>

        </section>

    )


}