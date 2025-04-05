type typeLogin = {
    email: string,
    password: string
}

export function AuthService({email, password}: typeLogin, url: string){
    const obj = {
        Email: email,
        Password: password
    }

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
    .then(async res => {
        if (res.ok === false){
            const message = await res.json()
            throw Error(`${res.status} - ${message.message}`);
        }
    
        return res.text()})

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


export async function fetchUserInfo(): Promise<{ name: string; email: string }>{

    const token = localStorage.getItem("authToken");
    
    return fetch("http://localhost:5110/user/info", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(result => {return result.json()})


}