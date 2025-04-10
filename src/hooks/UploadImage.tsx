import { useNavigate } from "react-router-dom"
import { HeaderProps } from "../interfaces/HeaderProps"
import { useEffect } from "react"



export default function useUploadingImage(ImageFileref: React.RefObject<HTMLInputElement>, {user, setUser} : HeaderProps) {
    const navigate = useNavigate()



    useEffect(() => {
        if (ImageFileref.current == null || ImageFileref.current == undefined) return

        ImageFileref.current.addEventListener("change", () => {

            if (ImageFileref.current?.files?.length == 0) return


            if (String(user.imageUrl?.split("/").pop()) === String(ImageFileref.current?.files?.[0]?.name)) {
                return
            }

            const file = ImageFileref.current?.files?.[0]

            const formData = new FormData()
            if (!file) return 

            formData.append("file", file)
            

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

                setUser({...user, imageUrl: `http://localhost:5110/images/${file.name}`})
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
        })
    }, [user])
    
    
    return undefined
}