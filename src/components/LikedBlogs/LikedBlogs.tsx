import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BlogInfo } from "../../interfaces/BlogInfo";
import SavedBlogs from "../SavedBlogs/SavedBlogs";
import handleError from "../../utils/handleError";



export default function LikedBlogs(){
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState<BlogInfo[]>([])

    const { username } = useParams();

    useEffect(() => {

        fetch(`http://localhost:5110/user/${username}/getLikedBlogs`, {
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


    }, [username, navigate])




    return (
        <SavedBlogs blogs={blogs} title="Liked" />
    )


}