import { useEffect, useMemo, useRef, useState } from "react"
import {  useNavigate } from "react-router-dom"
import useUploadingImage from "../../hooks/UploadImage"
import { HeaderProps } from "../../interfaces/HeaderProps"
import { Countries, UserValidations } from "../../utils/UserUtils"


export default function EditProfile({user, setUser}: HeaderProps){
    const ListCountry = useMemo<string[]>(() => {
        return Countries()
    }, [])
    const navigate = useNavigate()
    const ImageRef = useRef<HTMLInputElement>(null)
    const [originalImage, setOriginalImage] = useState<string | undefined>(user.imageUrl)
    const [fromCancel, setfromCancel] = useState(false)
    const [InputDict, setInputDict] = useState({
        username: user.name == user.email ? "" : user.name,
        fullName: user.fullName || "",
        country: user.country || ListCountry[0],
        email: user.email || "",
        bio: user.bio || ""
    })
    const [errorDict, setErrorDict] = useState({
        usernameError: false,
        fullNameError: false,
        emailError: false,
        bioError: false
    })

    useUploadingImage(ImageRef, {user, setUser}, setfromCancel)



    useEffect(() => {
        setInputDict({username: user.name == user.email ? "" : user.name, fullName: user.fullName || "", country: user.country || ListCountry[0], email: user.email || "", bio: user.bio || ""})


        if (fromCancel){
            setfromCancel(false)
            return
        }
        setOriginalImage(user.imageUrl)
    }, [user])


    function SubmitEditProfile(event: React.FormEvent<HTMLFormElement>){ 
        event.preventDefault()

        const finalData = UserValidations(InputDict, {...errorDict})

        if (finalData[1]){
            //@ts-expect-error bullshit
            setErrorDict({...finalData[0]})
            return
        }

        console.log(InputDict.country)

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
        if (ImageRef.current == null || ImageRef.current == undefined) { console.log("problem with the ImageRef"); return }

        ImageRef.current?.click()
    }

    function cancelHandler(){
        if (String(originalImage?.split("/").pop()) === String(ImageRef.current?.files?.[0]?.name)) {
            navigate("/profile")
            return
        }

        const formData = new FormData()
        
        if (originalImage == undefined || originalImage == null || originalImage == "" || originalImage == "/PersonDefault.png"){ 
            formData.append("file", "1")
        }
        else{
            if (originalImage?.split("/").pop() == undefined || originalImage?.split("/").pop() == null || originalImage?.split("/").pop() == "") {
                console.log("problem with the image name")
                return
            }
            //@ts-expect-error bullshit
            else formData.append("file", originalImage?.split("/").pop())
        }

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

            setfromCancel(true)
            setUser({...user, "imageUrl": originalImage || "/PersonDefault.png"})

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


    return (
        <section className="EditProfileComponent">
            <img src="/EditPageWallpaper.jpg" alt="" className="EditProfileImage"/>
            <img onClick={() => {ProfileImageHandler()}} className="EditProfileImageAccount" src={user.imageUrl} alt="" />
            
            <input ref={ImageRef} type="file" id="EditProfileImageFileInput" />

            <main>
                <h1 className="EditProfileTitle">Edit Profile</h1>


                <form className="EditProfileForm" action="POST" onSubmit={(event) => {SubmitEditProfile(event)}}>

                    <section className="EditProfileFormSection">
                        <article>
                            <label className="EditProfileUsername" htmlFor="Username">Username</label>
                            <input type="text" id="Username" placeholder="example_username" value={InputDict.username} onChange={((event) => {setInputDict({...InputDict, username: event?.target.value})})} />
                            {errorDict.usernameError && <p className="EditProfileError">Use 3-20 chars with numbers & @_.-</p>}
                        </article>

                        <article>
                            <label className="EditProfileFullName" htmlFor="fullName">Full Name</label>
                            <input  type="text" id="fullName" placeholder="John Doe" value={InputDict.fullName} onChange={(event) => {setInputDict({...InputDict, fullName: event?.target.value})}} />
                            {errorDict.fullNameError && <p className="EditProfileError">Use 2-20 letters with spaces</p>}
                        </article>
                    </section>

                    <section className="EditProfileFormSection">
                        <article>
                            <label className="EditProfileCountry" htmlFor="country">Country</label>
                            <select name="country" id="country"  value={InputDict.country} onChange={(event) => {setInputDict({...InputDict, country: event?.target.value})}}>
                               {ListCountry.map((country, index) => {
                                    return (
                                        <option key={index} value={country}>{country}</option>
                                    )
                               })} 
                            </select>
                        </article>

                        <article>
                            <label className="EditProfileEmail" htmlFor="email">Email</label>
                            <input type="text" id="email" placeholder="example_email" value={InputDict.email} onChange={(event) => {setInputDict({...InputDict, email: event?.target.value})}}/>
                            {errorDict.emailError && <p className="EditProfileError">Valid email required (user@example.com).</p>}
                        </article>
                    </section>

                    <article className="EditProfileFormBioDiv">
                        <label className="EditProfileBio" htmlFor="bio">Bio</label>
                        <textarea id="bio" placeholder="Write your bio here" value={InputDict.bio} onChange={(event) => {setInputDict({...InputDict, bio: event?.target.value})}}></textarea>
                        {errorDict.bioError && <p className="EditProfileError">Length between 5-150 chars</p>}
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