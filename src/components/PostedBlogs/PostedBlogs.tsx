import { useEffect, useState } from "react";
import handleError from "../../utils/handleError";
import { useNavigate, useParams } from "react-router-dom";
import { BlogInfo } from "../../interfaces/BlogInfo";
import SavedBlogs from "../SavedBlogs/SavedBlogs";


export default function PostedBlogs() {
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState<BlogInfo[]>([])

    const { username } = useParams();

    useEffect(() => {
        fetch(`http://localhost:5110/user/${username}/getBlogsByUser`, {
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
            console.log(data["$values"])
            setBlogs(data["$values"])
        }).catch(err => {
            handleError(err, navigate)
        })

    }, [username, navigate])




    return(
        <SavedBlogs blogs={blogs} title={"Posted"} setBlogs={setBlogs}/>
    )

}