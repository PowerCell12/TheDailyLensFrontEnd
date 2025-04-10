import { useRef, useState } from "react"
import {  useNavigate } from "react-router-dom"
import useUploadingImage from "../../hooks/UploadImage"
import { HeaderProps } from "../../interfaces/HeaderProps"


export default function EditProfile({user, setUser}: HeaderProps){
    const navigate = useNavigate()
    const [originalImage, setOriginalImage] = useState<string | undefined>(user.imageUrl)
    const ImageRef = useRef<HTMLInputElement>(null)
    const [InputDict, setInputDict] = useState({
        username: user.name || "",
        fullName: user.fullName || "",
        country: user.country || "",
        email: user.email || "",
        bio: user.bio || ""
    })

    useUploadingImage(ImageRef, {user, setUser})
    
    function SubmitEditProfile(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()

        console.log(user)

        fetch("http://localhost:5110/user/editProfile", {
            method: "POST",
            body: JSON.stringify({
                username: InputDict.username,
                fullName: InputDict.fullName,
                country: InputDict.country,
                email: InputDict.email,
                bio: InputDict.bio
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }

            return res.json()
        }).then((data) => {
            setUser({...user, name: data.username, fullName: data.fullName, country: data.country, email: data.email, bio: data.bio})
            navigate("/profile")
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

    function ProfileImageHandler(){
        if (ImageRef.current == null || ImageRef.current == undefined) return

        ImageRef.current?.click()
    }

    function cancelHandler(){

        if (String(originalImage?.split("/").pop()) === String(ImageRef.current?.files?.[0]?.name)) {
            navigate("/profile")
            return
        }

        const formData = new FormData()

        if (originalImage == undefined || originalImage == null || originalImage == "") {
            formData.append("file", "1")
        }
        else{
            formData.append("file", originalImage)

        if (ImageRef.current?.files?.[0] == undefined) {
            navigate("/profile")
            return
        }


        fetch("http://localhost:5110/user/uploadImageWithCancel", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        .then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }

            console.log(originalImage)
            setUser({...user, imageUrl: originalImage})

            navigate("/profile") 
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

        <section className="EditProfileComponent">
            <img src="/EditPageWallpaper.jpg" alt="" className="EditProfileImage"/>
            <img onClick={() => {ProfileImageHandler()}} className="EditProfileImageAccount" src={user.imageUrl == undefined ? "/PersonDefault.png" : user.imageUrl} alt="" />
            
            <input ref={ImageRef} type="file" id="EditProfileImageFileInput" />

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
                            <input  type="text" id="fullName" placeholder="John Doe" value={InputDict.fullName} onChange={(event) => {setInputDict({...InputDict, fullName: event?.target.value})}} />
                        </article>
                    </section>

                    <section className="EditProfileFormSection">
                        <article>
                            <label className="EditProfileCountry" htmlFor="country">Country</label>
                            <input type="text" id="country" placeholder="United States" value={InputDict.country} onChange={(event) => {setInputDict({...InputDict, country: event?.target.value})}} />
                        </article>

                        <article>
                            <label className="EditProfileEmail" htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="example_email" value={InputDict.email} onChange={(event) => {setInputDict({...InputDict, email: event?.target.value})}}/>
                        </article>
                    </section>

                    <article className="EditProfileFormBioDiv">
                        <label className="EditProfileBio" htmlFor="bio">Bio</label>
                        <textarea id="bio" placeholder="Write your bio here" value={InputDict.bio} onChange={(event) => {setInputDict({...InputDict, bio: event?.target.value})}}></textarea>
                    </article>

                    <article className="EditProfileFormButtons">
                        <button className="EditProfileCancel" type="button" onClick={() => {cancelHandler()}}>Cancel</button>

                        <button className="EditProfileSave" type="submit">Save Changes</button>
                    </article>

                </form>
            </main>

        </section>

    )


}