import { FormEvent, useState } from "react";
import AuthForm from "../AuthForm";
import { AuthService, fetchUserInfo } from "../../services/AuthService";
import { CheckEmailAndPassword} from "../../utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import handleError from "../../utils/handleError";
import { useAuth } from "../../contexts/useAuth";

export default function Login(){
    const { setUser } = useAuth();
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
                handleError(err, navigate)
            }) 


    }


    return (        

            <section className="AuthSection">
                <img src="/LoginPicture.jpg" alt="" className="AuthPicture"/>


                <AuthForm mode="login" formData={formData} setFormData={setFormData} onSubmitHandler={onSubmitHandler} errorData={errorData} />

            </section>
        )
}