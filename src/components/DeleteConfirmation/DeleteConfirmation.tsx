import { useState } from "react";

export default function DeleteConfirmation({setDeleteButtonClicked, deleteHandler, DELETEWritten, setDELETEWritten} : any){
    const [inputValue, setInputValue] = useState("")

    return (
        <div className="EditProfileDeleteAccountContainer" onClick={() => {setDeleteButtonClicked(false); setDELETEWritten(false)}}>
            <div className="EditProfileDeleteAccount" onClick={(event) => {event.stopPropagation()}}>
                <i onClick={() => {setDeleteButtonClicked(false); setDELETEWritten(false);}} className="fa-solid fa-xmark" id="EditProfileDeleteAccountClose"></i>
                <h1>Delete Account</h1>
                <p>Deleting your account will remove all of your information! This action cannot be undone!</p>
                <span>To confirm this, type "DELETE"</span>
                <section>
                    <input  value={inputValue} onChange={(e) => {setInputValue(e.target.value)}} type="text" />
                    <button type="button" onClick={() => {
                        if (inputValue.trim() != "DELETE"){
                            setDELETEWritten(true)
                        }
                        else{
                            deleteHandler()
                        }
                    }}>Delete Account</button>
                    {DELETEWritten && <p className="EditProfileDeleteAccountError">Please type "DELETE" to confirm</p>}
                </section>
            </div>
        </div>
    )


}