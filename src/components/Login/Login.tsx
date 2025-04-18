import { FormEvent, useState } from "react";
import AuthForm from "../AuthForm";
import { AuthService, fetchUserInfo } from "../../services/AuthService";
import { CheckEmailAndPassword} from "../../utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import { HeaderProps } from "../../interfaces/HeaderProps";

export default function Login({ setUser }: HeaderProps){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
        "TermsCheckbox": false
    });
    const [errorData, setErrorData] = useState({
        "email": false,
        "password": false,
        "TermsCheckbox": false
    });


    function onSubmitHandler(e: FormEvent): void{
        e.preventDefault();

        const validation = CheckEmailAndPassword(errorData, formData); 


        setErrorData(validation.newErrorData);
        
        if (validation.hasError) {
            return;
        }

        AuthService({email: formData.email, password: formData.password}, 'http://localhost:5110/auth/login')
        .then(data => {
            localStorage.setItem("authToken", data) // not a good practice

            fetchUserInfo().then(data => {
                setUser(data)
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
                <img src="/LoginPicture.jpg" alt="" className="AuthPicture"/>


                <AuthForm mode="login" formData={formData} setFormData={setFormData} onSubmitHandler={onSubmitHandler} errorData={errorData} />

            </section>
        )
}