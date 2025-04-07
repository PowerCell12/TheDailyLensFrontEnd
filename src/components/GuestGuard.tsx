import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function GuestGuard(){
    const navigate = useNavigate()

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("authToken") !== null

        if (isAuthenticated){
            navigate("/profile")
        }
    }, []) 
    
    return (  <Outlet /> )
    
}
