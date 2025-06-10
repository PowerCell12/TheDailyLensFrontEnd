import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import ForgotPassword from './ForgotPassword/ForgotPassword';
import { defaultUser } from '../utils/AuthUtils';


// @ts-expect-error it doesn't fucking work otherwise
export default function AuthForm({mode, formData, setFormData, onSubmitHandler, errorData}){
    const [hidePass, setHidePass] = useState({"password": true, "confirmPassword": true})
    const [passwordInputType, setPasswordInputType] = useState({"password": "password", "confirmPassword": "password"})
    const [ForgetPasswordClicked, setForgetPasswordClicked] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);

    const isLogin = mode == "login";


    function onChangeEvent(e: React.ChangeEvent<HTMLInputElement>){

        if (e.target.type == 'checkbox'){
            setFormData({...formData, [e.target.name]: e.target.checked})
        }
        else{
            setFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    // @ts-expect-error it doesn't fucking work otherwise
    function ChangeVisibilityPasswordHandler(e){

        // @ts-expect-error it doesn't fucking work otherwise
        if (hidePass[e.target.alt] ){
            setPasswordInputType({...passwordInputType, [e.target.alt]: "text"})
            setHidePass({...hidePass, [e.target.alt]: false})
        }
        else{
            setPasswordInputType({...passwordInputType, [e.target.alt]: "password"})
            setHidePass({...hidePass, [e.target.alt]: true})
        }

    }

    useEffect(() => {
        if (sendEmail === false) return;
        
        setTimeout(() => {
            setSendEmail(false);
            setForgetPasswordClicked(false);
        }, 4000)

    }, [sendEmail])


    function handleGoogleClick(){

        window.location.href = "http://localhost:5110/auth/google-login";

    }


    return (
        <form className="AuthForm" onSubmit={onSubmitHandler}>

            {ForgetPasswordClicked &&  <ForgotPassword setForgetPasswordClicked={setForgetPasswordClicked} setSendEmail={setSendEmail} currentUser={defaultUser}/>}

            {sendEmail && <p className='SendEmailAuthForm'>Check your email for the reset link!</p>}

            <h3>{isLogin ? "Welcome Back!" : "Register Now!"}</h3>

            { isLogin ?
                <p>Don't have an account? <Link to="/register">Register now</Link></p>
                :
                <p>Returning User? <Link to="/login">Access Your Account</Link></p>
            }

            <input type="text" className={`AuthInput ${errorData['email'] && "invalid" }`} placeholder="Email" name="email" value={formData["email"]} onChange={onChangeEvent}/>
            {errorData["email"] && <span className='error-text'>Valid email required (e.g., user@example.com).</span>}


            <input type={passwordInputType["password"]} className={`AuthInput ${errorData["password"] && "invalid"}`} placeholder="Enter your password" name="password" value={formData["password"]} onChange={onChangeEvent}/>
            {errorData["password"] && <span className='error-text'>Use 6+ characters with numbers & symbols.</span>}

            {isLogin && <p onClick={() => setForgetPasswordClicked(true)} className="LogInForgotPassword">Forgot password?</p>}

            {!isLogin && <input className={`AuthInput ${errorData["confirmPassword"] && "invalid"}`} placeholder="Confirm Your Password" name="confirmPassword" value={formData["confirmPassword"]} type={passwordInputType["confirmPassword"]} onChange={onChangeEvent}/>}
            {(!isLogin && errorData["confirmPassword"]) && <span className='error-text'>Passwords must match and be valid</span>}


            <div className={`ChecboxTerms ${errorData["TermsCheckbox"] && "invalid" }`} >
                <input type="checkbox" name="TermsCheckbox" checked={formData["TermsCheckbox"]} onChange={onChangeEvent}/>
                <label htmlFor="TermsCheckbox">I agree to the <Link to="/terms">Terms & Conditions</Link></label>
            </div>
            {errorData["TermsCheckbox"] && <span className="error-text" id={errorData["TermsCheckbox"] ? "invalidChecBoxSpan" : undefined}>Please accept the Terms & Conditions!</span>}
            
            <button type="submit">{ isLogin ? "Log In" : "Sign Up"}</button>

            <span className="divider">{ isLogin ? "Or Log in with" : "Or Sign up with"} </ span>

            <button onClick={handleGoogleClick} type="button"><img src="/GoogleLogo.png" alt="" /> <span>Google</span></button>

            <img  src="/PasswordEye.png" alt="password" className="PasswordEye" id={errorData["email"] ? "PasswordEyeInvalid" : undefined}  onClick={ChangeVisibilityPasswordHandler}/>
            {!isLogin && <img  id='ConfirmPassword' src="/PasswordEye.png" alt="confirmPassword" className={`PasswordEye ${(errorData["email"] || errorData["password"]) && "PasswordEyeInvalid"}`} onClick={ChangeVisibilityPasswordHandler}/> }
        </form>
    )

}