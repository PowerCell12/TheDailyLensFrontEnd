import { useEffect, useRef, useState } from "react"
import {  useNavigate, useParams } from "react-router-dom"
import handleError from "../../utils/handleError"
import { CommentBlog } from "../../interfaces/BlogInfo"
import ReactQuill from "react-quill"
import Comment from "../Comment/Comment"
import SortingComponent from "../SortingComponent/SortingComponent"


export default function ShowComments(){
    const navigate = useNavigate()
    const [blogData, setBlogData] = useState<CommentBlog[]>() // THE COMMENTS
    const { id } = useParams()
    const [editorData, setEditorData] = useState('')
    const [commentTitle, setCommentTitle] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [isReplaying, setIsReplaying] = useState(false)
    const [commentId, setCommentId] = useState(0) // WHAT
    const [oldData, setOldData] = useState({content: "", title: ""})
    const [replyingToReply, setReplyingToReply] = useState(false); // wHAT
    const [needsTitleOrEditorData, setNeedsTitleOrEditorData] = useState(false)
    const [show, setShow] = useState(false)
    const sortingRef = useRef<HTMLDivElement>(null); // Ref for sorting component
    const quillRef = useRef<ReactQuill | null>(null);

    const commentProps = { setBlogData, blogData, setIsEditing, setIsReplaying, commentId, setCommentId, replyingToReply, setReplyingToReply };

    useEffect(() => {

        const sortHandle = (e) => {
            if (sortingRef.current && !sortingRef.current.contains(e.target as Node)) {
                setShow(false);
            }   
        }

        document.addEventListener("mousedown", sortHandle)
        return () => {document.removeEventListener("mousedown", sortHandle)}

    }, [])


    useEffect(() => {
           window.scrollTo(0, 0);
          
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
                    formData.append("frontEndUrl", "ShowComments");

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
    

    useEffect(() => {
        fetch(`http://localhost:5110/blog/${id}/comments`, {
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
            console.log(data["$values"])
            setBlogData(data["$values"])

        }).catch(err =>{
            handleError(err, navigate)
        })


    }, [navigate, id])

    useEffect(() => {
        setOldData({content: editorData || "", title: commentTitle || ""});

        if (isEditing){
            setEditorData(blogData?.find(x => x.id == commentId)?.content || "");
            setCommentTitle(blogData?.find(x => x.id == commentId)?.title || "");
        }

        if(isReplaying){
            setEditorData("");
            setCommentTitle("");

            if (replyingToReply){

                fetch(`http://localhost:5110/user/${blogData?.find(x => x.id == commentId)?.authorId}`, {
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
                    setCommentTitle(`@${data.name}`)                    
                })

            }
        }

    }, [isEditing, isReplaying, replyingToReply, commentId, blogData])
    
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



    function CreateCommentHandler(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        console.log(editorData)
        console.log(commentTitle)

        console.log(commentTitle.split(" "))

        if (((!commentTitle || commentTitle == "") && (!editorData || editorData == "" || editorData == "<p><br></p>")) || ((commentTitle.split(" ")[0].startsWith("@") && commentTitle.split(" ").length == 1) && editorData == "")){
            setNeedsTitleOrEditorData(true)
            return
        }

        if (isReplaying){

            fetch("http://localhost:5110/comment/reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({title: commentTitle, content: editorData, ParentCommentId: commentId })
            }).then(async (res) => {
                if (!res.ok){
                    const message =  await res.json()
                    throw Error(`${res.status} - ${message.message}`);
                }
                return res.json()
            }).then(data => {
                setBlogData(prevData => prevData?.map(comment => {
                    if (comment.id == commentId){
                        return {...comment }
                    }
                    return comment
                 }))
                setBlogData(prevState => [...(prevState || []), data])
                setIsEditing(false);
                setIsReplaying(false);
                setCommentTitle("")
                setEditorData("")
            }).catch(err => {
                handleError(err, navigate)
            })
        }


        else if (isEditing){
            fetch("http://localhost:5110/comment", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({title: commentTitle, content: editorData, Id: commentId})
            }).then(async (res) => {
                if (!res.ok){
                    const message =  await res.json()
                    throw Error(`${res.status} - ${message.message}`);
                    
                }
            }).then(() => {
                setBlogData(prevState => prevState?.map(comment => {
                        if (comment.id == commentId){
                            return {...comment, content: editorData, title: commentTitle}
                        }
                        return comment
                }));
                setIsEditing(false);
                setIsReplaying(false);
                setCommentTitle("")
                setEditorData("")
            }).catch(err => {
                handleError(err, navigate)
            })
            
        }



        else{
            fetch(`http://localhost:5110/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({title: commentTitle, content: editorData, Id: id})
            }).then(async (res) => {
                if (!res.ok){
                    const message =  await res.json()
                    throw Error(`${res.status} - ${message.message}`);
                }
                return res.json()
            }).then(data => {
                setBlogData([data, ...(blogData || [])])
                setCommentTitle("")
                setEditorData("")
    
            }).catch(err => {
                handleError(err, navigate)
            })
        }

        setNeedsTitleOrEditorData(false)

    }



    return (
 
        <section className="ShowCommentsMainContainer">
            {(blogData && blogData?.length > 0) && <SortingComponent sortingRef={sortingRef} setShow={setShow} show={show} setData={setBlogData} text={"Comments"} />}


            <h1>{blogData?.length} Comments</h1>

            <section className="ShowCommentsButtons">
                <button  onClick={() => navigate(-1)}>Go Back</button>
                <button onClick={() => navigate("/")}>Home</button>
            </section>

            <form onSubmit={(e) => {CreateCommentHandler(e)}} className="CommentYourself">
                {isEditing && <h3>Edit Your Comment</h3>}
                {isReplaying && <h3 style={{fontSize: "1rem", marginBottom: ".1em", maxWidth: "27em"}}>Reply to {blogData?.find(x => x.id == commentId)?.title}</h3>}
                {(!isEditing && !isReplaying) && <h3>Add a Comment</h3>}

                <section>
                    <label htmlFor="CommentYourselfTitle">Comment Title</label>
                    <input type="text" id="CommentYourselfTitle" value={commentTitle} onChange={(e) => {setCommentTitle(e.target.value)}} />
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

                <section className="CommentYourselfButtons">
                    {isEditing && <button className="CommentYourselfButton" type="submit">Edit Comment</button>}
                    {isReplaying && <button className="CommentYourselfButton" type="submit">Reply</button>}
                    {(!isEditing && !isReplaying) && <button className="CommentYourselfButton" type="submit">Post Comment</button>}

                    {(isEditing || isReplaying) && <button className="CommentYourselfButton" onClick={() => {setIsEditing(false); setIsReplaying(false); setEditorData(oldData.content); setCommentTitle(oldData.title); setNeedsTitleOrEditorData(false) }}>Cancel</button>}
                </section>
                {needsTitleOrEditorData && <p className="CommentYourselfError">Please fill out at least one field</p>}

            </form>



            <section className="ShowCommentsActuallyComments">
                {blogData?.length == 0 && <p className="ShowCommentsNoComments">No comments yet!</p>}

                {blogData?.map((comment) => {
                    if (comment.parentCommentId != null) return null
                    if (comment.authorId == null) { console.log("comment.authorId == null"); return null }
                    if (comment.authorId !== null){
                        return ( <Comment key={comment.id} {...comment} {...commentProps} authorId={comment.authorId} commentId={commentId}  setNeedsTitleOrEditorData={setNeedsTitleOrEditorData}/> )
                    }                
                })}

            </section>

        </section>

    )

}