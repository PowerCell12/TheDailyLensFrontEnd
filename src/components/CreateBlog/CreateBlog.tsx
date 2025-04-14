import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function CreateBlog(){
    cosnt [editorData, setEditorData] = useState('');


    function createBlogComponent(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();




    }



    return  (

        <section className="CreateBlogComponent">

            <article  className="CreateBlogContent">

                <h1 className="CreateBlogTitle">Write a blog</h1>

                <p className="CreateBlogMessage">Share your thoughts with the world.</p>

                <form className="CreateBlogForm" action="" onSubmit={(event) => {createBlogComponent(event)}}>

                    <label htmlFor="BlogTitle">Blog Title</label>
                    <input type="text" id="BlogTitle" />





                    <button type="submit">Publish</button>
                </form>

            </article>




            <img width={"35%"} src="/createBlogPic.png" alt="" className="CreateBlogImage" />

        </section>

    )

}