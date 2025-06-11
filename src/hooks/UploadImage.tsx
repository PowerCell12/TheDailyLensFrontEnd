import { useNavigate } from "react-router-dom"
import { HeaderProps } from "../interfaces/HeaderProps"
import { useEffect } from "react"
import handleError from "../utils/handleError"



export function useUploadingImage(ImageFileref: React.RefObject<HTMLInputElement>, {user, setUser} : HeaderProps, {currentUser, setCurrentUser} : HeaderProps, setfromCancel: React.Dispatch<React.SetStateAction<boolean>> = () => {}){
    const navigate = useNavigate()


    useEffect(() => {
        if (user.id === "0") return
        if (ImageFileref.current == null || ImageFileref.current == undefined) return

        const ref = ImageFileref.current

        function handleFileChange(){

            if (ImageFileref.current?.files?.length == 0) return


            if (String(user.imageUrl?.split("/").pop()) === String(ImageFileref.current?.files?.[0]?.name)) {
                return
            }
 
            const file = ImageFileref.current?.files?.[0]

            const formData = new FormData()
            if (!file) return 

            formData.append("file", file)
            formData.append("frontEndUrl", "ProfilePage/EditProfile")
            formData.append("userId", user.id)

            console.log(file.name)

            fetch("http://localhost:5110/user/uploadImage", {
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

                return res.json()
            }).then((data) => {
                console.log(data)
                setfromCancel(true)
                if (currentUser.id == user.id){
                    setCurrentUser({...currentUser, imageUrl: `http://localhost:5110/${data.imageUrl}`})
                }
                setUser({...user, imageUrl: `http://localhost:5110/${data.imageUrl}`})
            })
            .catch(err => {
                handleError(err, navigate)
            })
        }

        ref.addEventListener("change", handleFileChange)

        return () => {
            ref.removeEventListener("change", handleFileChange)
        }
    }, [navigate, ImageFileref, user.id])
    
}