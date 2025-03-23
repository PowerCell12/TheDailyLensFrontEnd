import { useLocation } from "react-router-dom"

export default function ErrorPage(){
    const location = useLocation()

    const code = location.state.code;
    const message = location.state.message;


    return (
        <div>
            <h1>Error {code}</h1>
            <p>{message}</p>
        </div>
    )



}





