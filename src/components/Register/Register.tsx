import { FormEvent, useState } from "react";
import AuthForm from "../AuthForm";


export default function Register(){
    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
        "TermsCheckbox": false,
        "confirmPassword": ""
    })

    function onSubmitHandler(e: FormEvent){
        e.preventDefault()
        console.log(formData)
    }

    return (

        <section className="AuthSection">
            <AuthForm mode="register" formData={formData} setFormData={setFormData} onSubmitHandler={onSubmitHandler}/>


            <img src="/LoginPicture.jpg" alt="" className="AuthPicture"/>
        </section>
        
    )

}