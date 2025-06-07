import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { defaultUser, PasswordValidation } from "../../utils/AuthUtils";
import handleError from "../../utils/handleError";
import { useAuth } from "../../contexts/useAuth";
import { HeaderProps } from "../../interfaces/HeaderProps";

export default function ResetPassword(){
    const { email } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);
    const [userResetting, setUserResetting] = useState<HeaderProps["user"]>(defaultUser);

    const {user, setUser} = useAuth();

    const navigate = useNavigate();


    // NEEDS SECURITY CHECKS

    useEffect(() => {
        fetch(`http://localhost:5110/user/email/${email}`, {
            method: "GET",
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then((data) => {
            setUserResetting(data)
        }).catch(err => {
            handleError(err, navigate)
        })

    }, [email, navigate])


    function resetPasswordHandler(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();    

        if (userResetting.id == "0"){
            return;
        }

        if (!PasswordValidation(password) && !PasswordValidation(confirmPassword)) {
            setErrorPassword(true);
            setErrorConfirmPassword(true);
            return;
        }
        else{
            setErrorPassword(false);
            setErrorConfirmPassword(false);
        }

        if (!PasswordValidation(password)) {
            setErrorPassword(true);
            return;
        }else{
            setErrorPassword(false);
        }

        if (password !== confirmPassword || !PasswordValidation(confirmPassword)) {
            setErrorConfirmPassword(true);
            return;
        }else{
            setErrorConfirmPassword(false);
        }
        
        fetch(`http://localhost:5110/user/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then(() => {
            if (user.id === userResetting.id && user.accountType !== 1){
                const token = localStorage.getItem("authToken");
                localStorage.clear();
                setUser(defaultUser);

                fetch("http://localhost:5110/auth/logout", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }).then(async response => {
                        if (response.ok === false) {
                                throw Error("500 - Logout failed. Please try again.");
                        }
            
                        navigate("/");
                    })
                    .catch((err) => {
                        handleError(err, navigate)
                }); 
            }else{
                navigate("/");
            }

        }).catch((err) => {
            handleError(err, navigate);
        });
        
    }

    return (
        <section className="ResetPassword">
            <img onClick={() => setSeePassword(!seePassword)} className="ResetPasswordEyeFirst" src="/PasswordEye.png" alt="" />
            <img onClick={() => setSeeConfirmPassword(!seeConfirmPassword)} className={errorPassword ? "ResetPasswordEyeSecondError" : "ResetPasswordEyeSecond"} src="/PasswordEye.png" alt="" />

            <h1 className="ResetPasswordTitle">Choose a New Password for {email}</h1>

            <p className="ResetPasswordDescription">Choose a new secure password (at least 6 characters, including symbols and numbers).</p>

            <input placeholder="New Password" onChange={(e) => setPassword(e.target.value)} value={password} type={seePassword ? "text" : "password"} id={errorPassword ? "passwordError" : "password"} name="password" required />

            {errorPassword && <p className="ResetPasswordError">Use 6+ characters with numbers & symbols.</p>}

            <input placeholder="Confirm New Password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type={seeConfirmPassword ? "text" : "password"} id={errorConfirmPassword ? "confirmPasswordError" : "confirmPassword"} name="confirmPassword" required />
            
            {errorConfirmPassword && <p className="ResetPasswordError">Passwords must match and be valid</p>}

            <article className="ResetPasswordActions">
                <button onClick={resetPasswordHandler} className="ResetPasswordButton" type="submit">Reset Password</button>        
                <Link to={"/"} className="ResetPasswordLink">Back to Login</Link>
            </article>

        </section>
    );

}

