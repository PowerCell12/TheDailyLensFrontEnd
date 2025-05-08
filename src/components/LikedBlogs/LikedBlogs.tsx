import { useNavigate } from "react-router-dom";
import { HeaderProps } from "../../interfaces/HeaderProps";
import { useEffect, useState } from "react";
import { BlogInfo } from "../../interfaces/BlogInfo";
import SavedBlogs from "../SavedBlogs/SavedBlogs";
import handleError from "../../utils/handleError";



export default function LikedBlogs({user}: HeaderProps){
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState<BlogInfo[]>([])


    useEffect(() => {

        fetch(`http://localhost:5110/user/${user.name}/getLikedBlogs`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(async (res) => {
            if (!res.ok) {
                const message = await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }

            return res.json()
        }).then(data => {
            setBlogs(data["$values"])
            console.log(data["$values"])
        }).catch(err => {
            handleError(err, navigate)
        })


    }, [user.name, navigate])


    const customTags = ["javascript", "typescript", "python", "java", "csharp"]


    return (
        <SavedBlogs blogs={blogs} customTags={customTags} title="Liked" />
    )


}