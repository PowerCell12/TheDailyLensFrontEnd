import {useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../../contexts/useAuth"
import { useEffect } from "react"
import { RotatingLines } from 'react-loader-spinner'


export default function  AuthCallback(){
    const {setUser} = useAuth()
    const navigate = useNavigate()
  const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token")
        const userData = searchParams.get("user")
        const isNewUser = searchParams.get("isNewUser") === "true"


        const DecodedToken = token ? decodeURIComponent(token) : "";

        if (DecodedToken == ""){
            navigate(`/error/401/${encodeURIComponent("Unnable to validate your token, please login again")}`)
        }

        localStorage.setItem("authToken", DecodedToken)

        if (isNewUser){
            if (userData){
                const user = JSON.parse(decodeURIComponent(userData) ) 

                setUser(user)
            }
            else{
                navigate(`/error/500/${encodeURIComponent("Internal Server Error")}`)
            }


        }

        navigate("/")
    }, [navigate, searchParams, setUser])

    return (
        <div className="AuthCallbackContainer">
            <div className="AuthCallback">
                <p>Completing your login...</p>

                <RotatingLines 
                    strokeColor="#333333"
                    width="50"
                    ariaLabel="loading"
                />
            </div>
        </div>

    )
}