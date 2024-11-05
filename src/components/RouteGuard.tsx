import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";


export default function RouteGuard(){
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken") || "";
        
        if (token === "" || token === undefined) {
            navigate("/login");
        }
    }, []); 
    
    return (
        <Outlet />
    );

}