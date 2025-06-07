import { jwtDecode } from "jwt-decode"
import { HeaderProps } from "../interfaces/HeaderProps"

type typeLogin = {
    email: string,
    password: string
}

export function AuthService({email, password}: typeLogin, url: string){
    const obj = {
        Email: email,
        Password: password, 
        ImageUrl: "/PersonDefault.png"
    }

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(async res => {
        if (!res.ok){
            const message = await res.json()
            throw Error(`${res.status} - ${message.message}`);
        }    
        return res.json()
    })

}


export async function refreshToken(token: string): Promise<string | undefined>{
    const result = await  fetch("http://localhost:5110/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }        
    })

    if (result.status == 200){
        const data = await result.text();

        return data;
    }
}


export async function fetchUserInfo(): Promise<HeaderProps["user"]>{
    const date = new Date();
    const token = localStorage.getItem("authToken") || undefined;

    if (token === undefined || token === "" || token === null) {
        localStorage.removeItem("authToken");

        throw new  Error(`401 - Please Login to access this page`); 
    }

    const DecodedJWT = jwtDecode(token);

    // @ts-expect-error the token has expired date
    if (DecodedJWT.exp * 1000 <= date.getTime()) {
        const tokenFinal = await refreshToken(token);

        if (tokenFinal === undefined) {
            localStorage.removeItem("authToken");

            throw new Error("401 - Unnable to validate your token, please login again");
        }   

        localStorage.setItem("authToken", tokenFinal);

    }


    return fetch("http://localhost:5110/user/info", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
        }
    })
    .then(result => {return result.json()})
}