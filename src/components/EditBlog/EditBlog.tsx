import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../BlogForm/BlogForm";
import { useEffect, useState } from "react";
import handleError from "../../utils/handleError";
import { HeaderProps } from "../../interfaces/HeaderProps";
import { defaultUser } from "../../utils/AuthUtils";


export default function EditBlog(){
    const [user, setUser] = useState<HeaderProps["user"]>(defaultUser)
    const [editorData, setEditorData] = useState();
    const [title, setTitle] = useState(""); 
    const [thumbnail, setThumbnail] = useState<File | null>(null); // actually file 
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(""); // in memory link to the flie
    const [tags, setTags] = useState<string[]>([]); // an array for the tags
    const { id } = useParams()

    const navigate = useNavigate();


    useEffect(() => {    
            if (id == null) return;


            fetch(`http://localhost:5110/user/getUserInfoByByBlogId`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                    },
                    body: JSON.stringify(Number(id))
                }
            ).then(async (result) => {
                if (!result.ok){
                    const message =  await result.json()
                    throw Error(`${result.status} - ${message.message}`);
                }

                return result.json()
            }).then(data => {
                if (data.name == user.name && data.email == user.email){
                    return;
                }

                let imageUrl = "";
                if (data.imageUrl == "/PersonDefault.png" || data.imageUrl == null || data.imageUrl == undefined || data.imageUrl == ""){
                imageUrl = "/PersonDefault.png"
                }else imageUrl = `http://localhost:5110/${data.imageUrl}`

                setUser({name: data.name, email: data.email, accountType: data.accountType, country: data.country, fullName: data.fullName, imageUrl:  imageUrl, bio: data.bio, id: data.id, likedComments: data.likedComments["$values"], dislikedComments: data.dislikedComments["$values"], likedBlogs: data.likedBlogs["$values"]});
            }).catch(err =>  {
            handleError(err, navigate)
            }) 
    }, [user, navigate, id]);



    useEffect(() => {
            if (user.id === "0"){ return }

            fetch(`http://localhost:5110/blog/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }}).then(async (res) => {
                if (!res.ok){
                    const message =  await res.json()
                    throw Error(`${res.status} - ${message.message}`);
                }
                return res.json()
            }).then(data => {
                if (data.authorId !== user.id){
                    navigate("/")
                }

                const tags = data.tags["$values"]

                setEditorData(data.content)
                setTitle(data.title)
                setThumbnailUrl(data.thumbnail)
                setTags(tags)
            }).catch(err =>{
                handleError(err, navigate)
            })

    }, [navigate, id, user.id])


    function editBlogPost(pathImage: string, cleaned: string){
        console.log(pathImage)
        fetch(`http://localhost:5110/blog/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({title, thumbnail: pathImage, content: cleaned, tags: tags})
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
        }).then(() => {
            navigate(`/blog/${id}`)
        }).catch(err => {
            handleError(err, navigate)
        })
    }

    return (
        <section className="CreateBlogComponent">
                <h1 className="CreateBlogTitle">Edit Your Story</h1>
                <p className="CreateBlogMessage">Polish your story: refine every detail and share an even stronger narrative.</p>


                <BlogForm editorData={editorData} title={title} setTitle={setTitle} thumbnail={thumbnail} setThumbnail={setThumbnail} thumbnailUrl={thumbnailUrl} setThumbnailUrl={setThumbnailUrl} blogHandler={editBlogPost} setEditorData={setEditorData} serviceName={"EditBlog"} tags={tags} setTags={setTags} />
        </section>
    )

}