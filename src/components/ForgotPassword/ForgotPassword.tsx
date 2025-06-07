import { useState } from "react";
import { EmailValidation } from "../../utils/AuthUtils";
import handleError from "../../utils/handleError";
import { useNavigate } from "react-router-dom";


export default function ForgotPassword({setForgetPasswordClicked, setSendEmail, currentUser}){
    const [inputValue, setInputValue] = useState("");
    const [validEmail , setValidEmail] = useState(false);

    const navigate = useNavigate();

    function sendEmailHandler(e){
        e.preventDefault();

        if (inputValue.trim() === "" || EmailValidation(inputValue) === false){
            setValidEmail(true);
            return;
        }

        if (currentUser.accountType === "admin" && inputValue !== currentUser.email) {
            navigate(`/resetPassword/${inputValue}`)
            return
        }

        fetch("http://localhost:5110/SMTP/sendSingleEmail", { // have to catch this
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({currentEmail: inputValue, subject: "Reset Your Password", body: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 10px;font-size: 1.20em;">
                    
                    <h1>🔐 TheDailyLens - Password Reset Request</h1>
                    
                    <p>We received a request to reset your password. If you made this request, please click the link below to set a new password:</p>
                    
                    <a href="http://localhost:5173/resetPassword/${inputValue}" style="color: #1a73e8; text-decoration: none;">🔁 Reset My Password</a>

                    <p>If you did not request a password reset, please disregard this message. Your account remains secure. ✨</p>

                    <p>Thank you for being part of TheDailyLens!<br/>— The Team</p>
                </div>
            ` })
        })

        setSendEmail(true);
        setForgetPasswordClicked(false);
    }


    return (
        <div className="ForgetPasswordContainer" onClick={() => {setForgetPasswordClicked(false)}}>
            <div className="ForgetPassword" onClick={(event) => {event.stopPropagation()}}>
                <i onClick={() => {setForgetPasswordClicked(false)}} className="fa-solid fa-xmark" id="ForgetPasswordClose"></i>
                <h1>Reset Your Password</h1>
                <p>Forgot your password? We'll send you a secure link to create a new one.</p>
                {validEmail && <p id="ForgetPasswordValidEmail">Please enter a valid email address.</p>}
                <span className="ForgetPasswordSpan">Type your email address below</span>
                <section className="ForgetPasswordSection">
                    <input  value={inputValue} onChange={(e) => {setInputValue(e.target.value)}} type="text" />
                    <button className="ForgetPasswordButton" type="button" onClick={sendEmailHandler}>Send Email</button>
                </section>
            </div>
        </div>
    )
}