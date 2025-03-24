import { useLocation, useNavigate } from "react-router-dom"


export default function ErrorPage(){
    const location = useLocation()
    const navigate = useNavigate();

    const code = location.state.code;
    const message = location.state.message;


    return (
        
      <section className="ErrorPageComponent">

        <article className="ErrorPageContent">
            <h1 className="ErrorPageTitle">Oops! Something went wrong.</h1>
            <p className="ErrorPageMessage">{message} (Error code = {code})</p>

            <section className="ErrorPageButtons">
                <button className="ErrorPageHomeButton" onClick={() => navigate("/")}>Home</button>
                <button className="ErrorPageBackButton" onClick={() => navigate(-1)}>Go Back</button>
            </section>
        </article>

        <img className="ErrorPageImage" src="/ErrorPageImage.png" alt="" />

      </section>
    
    
    )



}





