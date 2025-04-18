import { FormEvent, useState } from "react";
import AuthForm from "../AuthForm";
import { AuthService, fetchUserInfo } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { CheckEmailAndPassword, PasswordValidation} from "../../utils/AuthUtils";
import { HeaderProps } from "../../interfaces/HeaderProps";


export default function Register({ setUser } : HeaderProps){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
        "TermsCheckbox": false,
        "confirmPassword": ""
    })
    const [errorData, setErrorData] = useState({
        "email": false,
        "password": false,
        "TermsCheckbox": false,
        "confirmPassword": false
    })

    
    function onSubmitHandler(e: FormEvent){
        e.preventDefault()
        

        const validation = CheckEmailAndPassword(errorData, formData); 

        if (formData.confirmPassword != formData.password || PasswordValidation(formData.confirmPassword) == false){
            validation.newErrorData = { ...validation.newErrorData, confirmPassword: true }
            validation.hasError = true
        }
        else{
            validation.newErrorData.confirmPassword = false
        }


        setErrorData(validation.newErrorData);
        
        if (validation.hasError) {
            return;
        }


        AuthService({email: formData.email, password: formData.password}, 'http://localhost:5110/auth/register')
            .then(async data => {
                localStorage.setItem("authToken", data) // not a good practice
                
                fetchUserInfo().then(data => {
                    setUser({...data})
                })

                navigate("/")
            })
            .catch(err => {
                    const status = err.message.split(" - ")[0]
                    const statusText = err.message.split(" - ")[1]
                    navigate("/error", {
                        state: {
                            code: status || 500,
                            message: statusText || "Network Error"
                        }  
                    })
                })       

    }

    return (

        <section className="AuthSection">
            <AuthForm mode="register" formData={formData} setFormData={setFormData} onSubmitHandler={onSubmitHandler} errorData={errorData}/>


            <img src="/LoginPicture.jpg" alt="" className="AuthPicture"/>
        </section>
        
    )

}