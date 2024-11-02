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

}


export function Logout(token: string){
    return fetch("http://localhost:5110/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

}