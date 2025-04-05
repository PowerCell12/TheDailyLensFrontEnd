import { refreshToken } from "../services/AuthService";
import { jwtDecode } from "jwt-decode";


export async function FetchWithAuthorization(url: string, header: string, options: unknown = {}, body: unknown = {}) {
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


    return fetch(url, {
        method: header,
        headers: {
            ...(typeof options === "object" && options !== null ? options : {}),
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body)
    });
}