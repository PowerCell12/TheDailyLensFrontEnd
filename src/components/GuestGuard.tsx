import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/useAuth"

export default function GuestGuard(){
    const { user } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("authToken") !== null

        if (isAuthenticated){
            navigate(`/profile/${user.name}`)
        }
    }, []) 
    
    return (  <Outlet /> )
    
}
