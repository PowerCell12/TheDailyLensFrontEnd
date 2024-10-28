import { Link } from "react-router-dom";
import '../../../public/css/all.css' ;
import { FormEvent, useState } from "react";

export default function Login(){
    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
        "TermsCheckbox": false
    });
    const [hidePass, setHidePass] = useState(true)
    const [passwordInputType, setPasswordInputType] = useState("password")




    function onSubmitHandler(e: FormEvent): void{
        e.preventDefault();
        console.log(formData)
    
        

    }



    function onChangeEvent(e: React.ChangeEvent<HTMLInputElement>){
        if (e.target.type == 'checkbox'){
            setFormData({...formData, [e.target.name]: e.target.checked})
        }
        else{
            setFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    function ChangeVisibilityPasswordHandler(){
        
        if (hidePass){
            setPasswordInputType("text")
            setHidePass(false)
        }
        else{
            setPasswordInputType("password")
            setHidePass(true)
        }

    }

    return (        

            <section className="LoginSection">
                <img src="/LoginPicture.jpg" alt="" className="LoginPicture"/>

                <form className="LoginForm" onSubmit={onSubmitHandler}>
                        <h3>Welcome Back!</h3>

                        <p>Don't have an account? <Link to="/register">Register now</Link></p>
        
                        <input type="text" className="LoginInput" placeholder="Email" name="email" value={formData["email"]} onChange={onChangeEvent}/>

                        <input type={passwordInputType} className="LoginInput" placeholder="Enter your password" name="password" value={formData["password"]} onChange={onChangeEvent}/>
                        <img src="/PasswordEye.png" alt="" className="PasswordEye" onClick={ChangeVisibilityPasswordHandler}/>

                        <div className="ChecboxTerms">
                            <input type="checkbox" name="TermsCheckbox" checked={formData["TermsCheckbox"]} onChange={onChangeEvent}/>
                            <label htmlFor="TermsCheckbox">I agree to the <Link to="/terms">Terms & Conditions</Link></label>
                        </div>
                        
                        <button type="submit">Log In</button>

                        <span className="divider">Or Log in with </ span>

                        <button type="button"><img src="/GoogleLogo.png" alt="" /> <span>Google</span></button>

                </form>

            </section>
        )
}