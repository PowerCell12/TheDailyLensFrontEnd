import {  useEffect, useMemo, useRef, useState } from "react"
import {  useNavigate, useParams } from "react-router-dom"
import { Countries, UserValidations } from "../../utils/UserUtils"
import handleError from "../../utils/handleError"
import { HeaderProps } from "../../interfaces/HeaderProps"
import { defaultUser } from "../../utils/AuthUtils"
import { useAuth } from "../../contexts/useAuth"


export default function EditProfile(){
    const [user, setUser] = useState<HeaderProps["user"]>(defaultUser)
    const {user: currentUser, setUser: setCurrentUser} = useAuth()
    const ListCountry = useMemo<string[]>(() => {
        return Countries()
    }, [])
    const navigate = useNavigate()
    const ImageRef = useRef<HTMLInputElement>(null)
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
    const [Imagefile, setImagefile] = useState<File>()
    const [ImagefileURL, setImagefileURL] = useState<string>("")

    const {username } = useParams()


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
                if (res.imageUrl == null) res.imageUrl = "/PersonDefault.png"
                setUser({...res, imageUrl: res.imageUrl == "/PersonDefault.png" ? "/PersonDefault.png" : `http://localhost:5110/${res.imageUrl}`})
            }).catch(err => {
                handleError(err, navigate)
            })
    
    
    }, [navigate, username])


    useEffect(() => {
        setInputDict({
            username: user.name == user.email ? "" : user.name,
            fullName: user.fullName || "",
            country: user.country || ListCountry[0],
            email: user.email || "",
            bio: user.bio || ""
        })
    }, [user, ListCountry])

    useEffect(() => {
    
        function EditProfilePicHandler(){

            if (!ImageRef.current || !ImageRef.current.files || ImageRef.current.files[0] == undefined || ImageRef.current.files[0] == null) return


            setImagefile(ImageRef.current.files[0])
            setImagefileURL(URL.createObjectURL(ImageRef.current.files[0]))
        }


        ImageRef.current?.addEventListener("change", EditProfilePicHandler)

        return () => {
            ImageRef.current?.removeEventListener("change", EditProfilePicHandler)
        }


    }, [])

    function editPRofileHandlerFinal(data: { imageUrl: string }){
        fetch("http://localhost:5110/user/editProfile", {
                method: "POST",
                body: JSON.stringify({
                    username: InputDict.username,
                    fullName: InputDict.fullName,
                    country: InputDict.country,
                    email: InputDict.email,
                    bio: InputDict.bio,
                    currentName: username
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
            }).then((data1) => {
                console.log(data1.imageUrl)
                if (user.id == currentUser.id){
                    if (data.imageUrl == "/PersonDefault.png"){
                        setCurrentUser({...user, name: data1.username, fullName: data1.fullName, country: data1.country, email: data1.email, bio: data1.bio, imageUrl: data.imageUrl})
                    }
                    else{
                        setCurrentUser({...user, name: data1.username, fullName: data1.fullName, country: data1.country, email: data1.email, bio: data1.bio, imageUrl: `http://localhost:5110/${data.imageUrl}`})
                    }
                }
                navigate(`/profile/${data1.username}`)
            }).catch(err => {
                handleError(err, navigate)
            })  
    }


    function uploadImage(Imagefile: string | Blob){
        const formData = new FormData()

        formData.append("file", Imagefile);
        formData.append("frontEndUrl", "EditProfile");
        formData.append("userId", user.id);
        
        return fetch("http://localhost:5110/user/uploadImage", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(async (res) => {
            if (!res.ok){
                if (res.status == 500) throw Error("500 - Internal Server Error")
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then(async (data) => {
            editPRofileHandlerFinal(data)
        }).catch(err => {
            handleError(err, navigate)
        })   
    }

    function resetProfileImage(){
        return fetch("http://localhost:5110/user/resetProfileImage", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user.id)
        }).then (async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }

            editPRofileHandlerFinal({imageUrl: "/PersonDefault.png"})

        }).catch(err => {
            handleError(err, navigate)
        })
    }


    async function SubmitEditProfile(event: React.FormEvent<HTMLFormElement>){ 
        event.preventDefault()

        const finalData = UserValidations(InputDict, {...errorDict})

        if (finalData[1]){
            //@ts-expect-error bullshit
            setErrorDict({...finalData[0]})
            return
        }

        if (Imagefile){
            await uploadImage(Imagefile)
        }

        if (ImagefileURL == "/PersonDefault.png"){
           await resetProfileImage()
        }

        navigate(`/profile/${user.name}`)
    }

    function ProfileImageHandler(){
        if (ImageRef.current == null || ImageRef.current == undefined) { console.log("problem with the ImageRef"); return }

        ImageRef.current?.click()
    }

    function cancelHandler(){
        navigate(`/profile/${user.name}`)
    }



    function DeleteProfilePicHandler(){
        if (ImagefileURL !== "" && ImagefileURL !== "/PersonDefault.png") {
            URL.revokeObjectURL(ImagefileURL)
            setImagefileURL("")
        }
        else{
            if (user.imageUrl == "/PersonDefault.png") return
            setImagefileURL("/PersonDefault.png")
        }
        
    }

    return (
        <section className="EditProfileComponent">
            <img src="/deleteProfilePic.png" alt="" id="DeleteProfilePicEdit" onClick={() => {DeleteProfilePicHandler()}}/>
            <img src="/EditPageWallpaper.jpg" alt="" className="EditProfileImage"/>
            <img onClick={() => {ProfileImageHandler()}} className="EditProfileImageAccount" src={ImagefileURL == "" ? user.imageUrl : ImagefileURL} alt="" />
            
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