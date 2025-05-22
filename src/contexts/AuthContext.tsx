import { createContext, useEffect, useState } from "react";
import { HeaderProps } from "../interfaces/HeaderProps";
import { defaultUser } from "../utils/AuthUtils";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../services/AuthService";
import handleError from "../utils/handleError";

export const AuthContext = createContext<HeaderProps>({} as HeaderProps);


export function AuthProvider( { children }){
    const [user , setUser] = useState<HeaderProps["user"]>(defaultUser);
    const navigate = useNavigate()

    useEffect(() => {
            const token = localStorage.getItem("authToken");
    
            if (token === null || token === undefined || token === "") {
                return;
            }
    
            fetchUserInfo().then(data => {
                if (data.name == user.name && data.email == user.email){
                    return;
                }

                let imageUrl = "";
                if (data.imageUrl == "/PersonDefault.png" || data.imageUrl == null || data.imageUrl == undefined || data.imageUrl == ""){
                imageUrl = "/PersonDefault.png"
                }else imageUrl = `http://localhost:5110/${data.imageUrl}`

                setUser({name: data.name, email: data.email, accountType: data.accountType, country: data.country, fullName: data.fullName, imageUrl:  imageUrl, bio: data.bio, id: data.id, likedComments: data.likedComments["$values"], dislikedComments: data.dislikedComments["$values"], likedBlogs: data.likedBlogs["$values"]});
            }).catch(err =>  {
            handleError(err, navigate)
            }) 
    
            
    }, [user, navigate]);


    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    ) 
        

}
