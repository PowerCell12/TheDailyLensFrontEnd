import { FormEvent, useState } from "react";
import AuthForm from "../AuthForm";

export default function Login(){
    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
        "TermsCheckbox": false
    });


    function onSubmitHandler(e: FormEvent): void{
        e.preventDefault();
        console.log(formData)
    }


    return (        

            <section className="AuthSection">
                <img src="/LoginPicture.jpg" alt="" className="AuthPicture"/>


                <AuthForm mode="login" formData={formData} setFormData={setFormData} onSubmitHandler={onSubmitHandler}/>

            </section>
        )
}