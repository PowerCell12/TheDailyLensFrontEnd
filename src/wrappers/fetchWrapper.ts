import { refreshToken } from "../services/AuthService";
import { jwtDecode } from "jwt-decode";


export async function fetchWithAuthorization(url: string, header: string, options: unknown = {}, body: unknown = {}) {
    const date = new Date();
    const token = localStorage.getItem("authToken") || "";


    try{
        if (!token) {
            return;
        }

        const DecodedJWT = jwtDecode(token);

        // @ts-expect-error the token has expired date
        if (DecodedJWT.exp * 1000 <= date.getTime()) {
            const tokenFinal = await refreshToken(token);

            if (tokenFinal === undefined) {
                throw new Error("Failed to get the new JWT token");
            }   

            localStorage.setItem("authToken", tokenFinal);

        }

    }
    catch (err){

        if (err instanceof Error) {
            console.error('Token refresh failed:', err.message);
        }

        localStorage.removeItem("authToken");
        
        throw err;
    }   
    


    return fetch(url, {
        method: header,
        headers: {
            // @ts-expect-error i don't want to deal with it
            ...options,
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    });
}