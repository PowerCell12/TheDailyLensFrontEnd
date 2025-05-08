import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../BlogForm/BlogForm";
import { useEffect, useState } from "react";
import handleError from "../../utils/handleError";


export default function EditBlog(){
    const [editorData, setEditorData] = useState();
    const [title, setTitle] = useState(""); 
    const [thumbnail, setThumbnail] = useState<File | null>(null); // actually file 
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(""); // in memory link to the flie
    const [tags, setTags] = useState<string[]>([]); // an array for the tags
    const { id } = useParams()

    const navigate = useNavigate();


    useEffect(() => {
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
                const tags = data.tags["$values"]

                setEditorData(data.content)
                setTitle(data.title)
                setThumbnailUrl(data.thumbnail)
                setTags(tags)
            }).catch(err =>{
                handleError(err, navigate)
            })

    }, [navigate, id])


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