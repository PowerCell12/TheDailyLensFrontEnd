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
    .then(res => {return res.text()})
    .then(data => {
        localStorage.setItem("authToken", data) // not a good practice
    })
    .catch(err => {
        console.log(err)
    });  

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