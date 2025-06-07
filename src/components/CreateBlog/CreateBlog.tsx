import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handleError from '../../utils/handleError';
import BlogForm from '../BlogForm/BlogForm';
import { useAuth } from '../../contexts/useAuth';
import { stripHtml  } from '../../utils/htmlUtils';

export default function CreateBlog() {
    const [editorData, setEditorData] = useState('');
    const [title, setTitle] = useState(""); 
    const [thumbnail, setThumbnail] = useState<File | null>(null); // actually file 
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(""); // in memory link to the flie
    const [tags, setTags] = useState<string[]>([]); // an array for the tags

    const navigate = useNavigate();
    const { user } = useAuth();
    

    function createBlogPost(pathImage: string, cleaned: string){
        fetch("http://localhost:5110/blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({title, thumbnail: pathImage, content: cleaned, tags: tags})
        }).then(async (data) => {
            if (!data.ok){
                const message =  await data.json()
                throw Error(`${message.status} - ${message.statusText}`);
            }
            return data.json()
        }).then(data => {

            fetch(`http://localhost:5110/SMTP/sendEmail`, { // need a catch for this 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({subject: `${user.name} Just Published a New Blog: "${title}"`, body: `
                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 10px;font-size: 1.35em;">
                        <p>Hey there,</p>

                        <p><strong>${user.name}</strong> has just shared something new!</p>

                        <p style="font-style: italic; color: #555;">
                            “${stripHtml(cleaned).slice(0, 200)}...”
                        </p>

                        <p>
                            👉 <a href="http://localhost:5173/blog/${data}" style="color: #1a73e8; text-decoration: none;">
                            Read the full post here
                            </a>
                        </p>

                        <p>Enjoy reading!<br/>— The Team</p>
                        </div>
                `, currentEmail: user.email})
            })

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