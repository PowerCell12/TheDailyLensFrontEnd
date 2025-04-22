import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';


import ReactQuill, { Quill }  from 'react-quill';
// @ts-expect-error bs ys
import { ImageDrop } from 'quill-image-drop-module';
import QuillResizeImage from 'quill-resize-image';

Quill.register('modules/imageDrop', ImageDrop);
Quill.register("modules/resize", QuillResizeImage);


export default function CreateBlog() {
    const [editorData, setEditorData] = useState('');
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const quillRef = useRef<ReactQuill | null>(null);


    useEffect(() => {
          // @ts-expect-error this bs
            quillRef.current
            .getEditor()
            .getModule('toolbar')
            .addHandler('image', () => {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.click();
            
                input.onchange = () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    const editor = quillRef.current?.getEditor();
                    const range = editor?.getSelection(); 

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("frontEndUrl", "CreateBlog");

                    fetch("http://localhost:5110/user/uploadImage", {
                        method: "POST",
                        body: formData
                    })
                    .then(async (res) => {
                        if (!res.ok) {
                            const message = await res.json();
                            throw new Error(`${res.status} - ${message.message}`);
                        }
                        return await res.json();
                    })
                    .then(data => {
                        if (range && editor) {
                            editor.insertEmbed(range.index, "image", `http://localhost:5110/${data.imageUrl}`);
                        }
                    })
                    .catch(err => {
                        const [status, ...messageParts] = err.message.split(" - ");
                        const statusText = messageParts.join(" - ") || "Network Error";
                        navigate("/error", {
                            state: {
                                code: status || 500,
                                message: statusText
                            }  
                        })
                    })
            }})

    }, [quillRef, navigate])
    


    const modules = {
        resize: {
            locale: {},
        },
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ],
        },
        imageDrop: true,
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'align',
        'link', 'image'
    ];


    function createBlogComponent(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("Content:", editorData);
        // Add your API submission logic here
    }


    return (
        <section className="CreateBlogComponent">
                <h1 className="CreateBlogTitle">Write Your Story</h1>
                <p className="CreateBlogMessage">Share your ideas, experiences, and stories with readers around the globe.</p>

                <form className="CreateBlogForm" onSubmit={createBlogComponent}>
                    <article>
                        <label htmlFor="BlogTitle">Blog Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            id="BlogTitle"
                            required
                        />
                    </article>

                    <img src="/quill-pen.png" className='CreateBlogImage' alt="" />
                    <img src="/quill-pen.png" className='CreateBlogImage2' alt="" />


                    <div className='EditorWrapper'>
                        <ReactQuill
                            ref={quillRef}
                            value={editorData}
                            onChange={setEditorData}
                            modules={modules}
                            formats={formats}
                        />
                    </div>

                    <article className='CreateBlogButtons'>
                        <button onClick={() => navigate("/profile")}>Cancel</button>
                        <button type="submit">Publish</button>
                    </article>
                </form>
            
        </section>
    )
}