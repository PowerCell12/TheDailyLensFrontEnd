import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';


import ReactQuill, { Quill }  from 'react-quill';
// @ts-expect-error bs ys
import { ImageDrop } from 'quill-image-drop-module';
import QuillResizeImage from 'quill-resize-image';
import handleError from '../../utils/handleError';

Quill.register('modules/imageDrop', ImageDrop);
Quill.register("modules/resize", QuillResizeImage);


export default function BlogForm({editorData, title, setTitle, thumbnail, setThumbnail, thumbnailUrl, setThumbnailUrl, blogHandler, setEditorData, serviceName, tags, setTags}){
    const [previewThumbnail, setPreviewThumbnail] = useState(false); // a boolean for previewing the thumbnail
    const [tagsCount, setTagsCount] = useState(4); // a counter for the tags
    const [overTagCount, setOverTagCount] = useState(false); // a boolean for the tag count
    const tagInputRef = useRef<HTMLInputElement>(null);
    const ThumbnailInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const quillRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        setTagsCount(4 - tags.length);
    }, [tags.length])

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
                            handleError(err, navigate)
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

    function handleTagInput(e){
        if (e.key === "Enter"){
            e.preventDefault();
            e.stopPropagation();

            if (tagInputRef.current?.value === ""){
                setOverTagCount(false);
                return;
            }

            const tagInput = tagInputRef.current?.value.split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "")
            .map(tag => tag.toLowerCase())
            .filter((tag, index, self) => self.indexOf(tag) === index);

            if (tagsCount - (tagInput?.length ?? 0) < 0){
                setOverTagCount(true);
                return;
            }


            setTagsCount(prev => prev - (tagInput?.length ?? 0));
            tagInputRef.current!.value = "";
            setOverTagCount(false);
            setTags(prev => [...prev, ...(tagInput ?? [])]);
        }

    }


    function createBlogComponent(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let pathImage = ""
        const cleaned = DOMPurify.sanitize(editorData);

        if (serviceName === "EditBlog" && !thumbnail){
            pathImage = thumbnailUrl
            blogHandler(pathImage, cleaned)
        }   
        else if (!thumbnail){    
            pathImage = "/BlogThumbnailDefault.jpg"

            blogHandler(pathImage, cleaned)
        }
        else if (thumbnail){
            const formData = new FormData();
            formData.append("file", thumbnail);
            formData.append("frontEndUrl", "CreateBlog");

            fetch("http://localhost:5110/user/uploadImage", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: formData
            }).then(async (res) => {
                if (!res.ok){
                    const message =  await res.json()
                    throw Error(`${res.status} - ${message.message}`);
                }

                return res.json()
            }).then(data =>{
                console.log(data)
                pathImage = `http://localhost:5110/${data.imageUrl}`

                blogHandler(pathImage, cleaned)
            }).catch(err => {
                handleError(err, navigate)
            })
        }
    }




    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.size > 5_242_880) {
            return 
        }

        setThumbnail(file);
        setThumbnailUrl(URL.createObjectURL(file));
        setPreviewThumbnail(true);
    }

    function ClearThumbnail(handler: string){
        if (handler != "discard"){
            setPreviewThumbnail(false);
        }
        else{
            setThumbnail(null);
            setThumbnailUrl("");
            setPreviewThumbnail(false);

            if (ThumbnailInputRef.current) {
                ThumbnailInputRef.current.value = "";
            }
        }
    }

    function ChangeVisibilityPasswordHandler(){
        if (thumbnailUrl){
            setPreviewThumbnail(true)
        }
    }

    function removeTag(tag: string){
        setTags(prev => prev.filter(t => t !== tag));
        setTagsCount(prev => prev  + 1);
        setOverTagCount(false);
    }

    function removeAllTags(e){
        e.preventDefault();
        e.stopPropagation();

        if (tagInputRef.current) {
            tagInputRef.current.value = "";
        }

        setTags([]);
        setTagsCount(4);
        setOverTagCount(false);
    }

    return (
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

                <article className='CreateBlogThumbnail'>
                    <img src="/PasswordEye.png" onClick={() => { ChangeVisibilityPasswordHandler() }} className='SeeThumbnail' alt="" />
                    <span className='CreateBlogThumbnailMessage'>Recommended size: 1200x675 px; must be under 2 MB</span>
                    <label htmlFor="BlogThumbnail" id='CreateBlogThumbnailButton'>Select Thumbnail Image</label>
                    <input ref={ThumbnailInputRef} id="BlogThumbnail" type="file" accept='image/*' onChange={(e) => { handleFileChange(e) } }/>
                    {previewThumbnail && (
                            <div className='thumbnail-preview-container' onClick={() => { ClearThumbnail("outside")}}>
                            <div className="thumbnail-preview"  onClick={(e) => { e.stopPropagation() }}>
                                <img 
                                    src={thumbnailUrl} 
                                    alt="Selected thumbnail preview" 
                                    className="thumbnail-preview-image"
                                />
                                <i onClick={() => { ClearThumbnail("x mark") }} className="fa-solid fa-xmark" id="CreateBlogThumbnailDeleteMark"></i>
                                <article id='thumbnail-preview-buttons'>
                                    <button  type="button"  onClick={() => { ClearThumbnail("discard") }} className="thumbnail-preview-button">Discard Selection</button>
                                </article>
                            </div>
                        </div>
                    )}
                </article>

                <img src="/quill-pen.png" className='CreateBlogImage' alt="" />
                <img src="/quill-pen.png" className='CreateBlogImage2' alt="" />



                <section className='BlogTagsBlogForm'>
                    <ul id='tag-list'></ul>
                    <header className='BlogTagsHeader'>
                        <img src="/tags.png" alt="" />
                        <h4>Tags</h4>
                        <img src="/tags.png" alt="" />
                    </header>
                    <p>Press enter or add a comma after each tag</p>
                    <section className='BlogTagsDiv'>
                        {tags.map((tag, index) => (
                            <div key={index} className={"BlogTags"}>
                                <p title={tag}>{tag}</p>
                                <i onClick={() => {removeTag(tag)}} className="fa-solid fa-xmark fa-lg BlogTagRemove"></i>
                            </div>
                        ))}
                        <input onKeyDown={handleTagInput}  ref={tagInputRef} type="text" id='tag-input' placeholder='Add a tag' />
                    </section>
                    <section className='BlogTagsButtons'>
                        <span>{tagsCount} tags are remaining</span>
                        <button onClick={(e) => {removeAllTags(e)}}>Remove All</button>
                    </section>
                    {overTagCount && (
                        <p className='BlogTagsError'>You have gone over the tag limit, remove some tags (max 4)</p>
                    )}
                </section>



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
                    <button onClick={() => navigate("/")}>Cancel</button>
                    <button type="submit">Publish</button>
                </article>
        </form>
    )

}