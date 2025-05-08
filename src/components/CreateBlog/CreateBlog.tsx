import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handleError from '../../utils/handleError';
import BlogForm from '../BlogForm/BlogForm';



export default function CreateBlog() {
    const [editorData, setEditorData] = useState('');
    const [title, setTitle] = useState(""); 
    const [thumbnail, setThumbnail] = useState<File | null>(null); // actually file 
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(""); // in memory link to the flie
    const [tags, setTags] = useState<string[]>([]); // an array for the tags

    const navigate = useNavigate();
    


    function createBlogPost(pathImage: string, cleaned: string){
        fetch("http://localhost:5110/blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({title, thumbnail: pathImage, content: cleaned, tags: tags})
        }).then(() => {
            navigate("/")
        }).catch(err => {
            handleError(err, navigate)
        })
    }


    return (
        <section className="CreateBlogComponent">
                <h1 className="CreateBlogTitle">Tell Your Story</h1>
                <p className="CreateBlogMessage">Share your ideas, experiences, and stories with readers around the globe.</p>

                <BlogForm editorData={editorData} title={title} setTitle={setTitle} thumbnail={thumbnail} setThumbnail={setThumbnail} thumbnailUrl={thumbnailUrl} setThumbnailUrl={setThumbnailUrl} blogHandler={createBlogPost} setEditorData={setEditorData} serviceName={"CreateBlog"} tags={tags} setTags={setTags} />
            
        </section>
    )
}