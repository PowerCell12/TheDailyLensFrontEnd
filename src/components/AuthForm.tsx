import { Link } from 'react-router-dom';
import { useState } from "react";


// @ts-expect-error it doesn't fucking work otherwise
export default function AuthForm({mode, formData, setFormData, onSubmitHandler}){
    const [hidePass, setHidePass] = useState({"password": true, "confirmPassword": true})
    const [passwordInputType, setPasswordInputType] = useState({"password": "password", "confirmPassword": "password"})


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


    return (
        <form className="AuthForm" onSubmit={onSubmitHandler}>

            <h3>{isLogin ? "Welcome Back!" : "Register Now!"}</h3>

            { isLogin ?
                <p>Don't have an account? <Link to="/register">Register now</Link></p>
                :
                <p>Returning User? <Link to="/login">Access Your Account</Link></p>
            }

            <input type="text" className="AuthInput" placeholder="Email" name="email" value={formData["email"]} onChange={onChangeEvent}/>



            <input type={passwordInputType["password"]} className="AuthInput" placeholder="Enter your password" name="password" value={formData["password"]} onChange={onChangeEvent}/>

            {!isLogin && <input className="AuthInput" placeholder="Confirm Your Password" name="confirmPassword" value={formData["confirmPassword"]} type={passwordInputType["confirmPassword"]} onChange={onChangeEvent}/>}



            <div className="ChecboxTerms">
                <input type="checkbox" name="TermsCheckbox" checked={formData["TermsCheckbox"]} onChange={onChangeEvent}/>
                <label htmlFor="TermsCheckbox">I agree to the <Link to="/terms">Terms & Conditions</Link></label>
            </div>
            
            <button type="submit">{ isLogin ? "Log In" : "Sign Up"}</button>

            <span className="divider">{ isLogin ? "Or Log in with" : "Or Sign up with"} </ span>

            <button type="button"><img src="/GoogleLogo.png" alt="" /> <span>Google</span></button>

            <img src="/PasswordEye.png" alt="password" style={!isLogin ? { bottom: '48.9%' } : undefined} className="PasswordEye"  onClick={ChangeVisibilityPasswordHandler}/>
            {!isLogin && <img  id='ConfirmPassword' src="/PasswordEye.png" alt="confirmPassword" className="PasswordEye" onClick={ChangeVisibilityPasswordHandler}/> }
        </form>
    )

}