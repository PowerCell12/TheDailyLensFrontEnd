import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import handleError from "../../utils/handleError";
import { HeaderProps } from "../../interfaces/HeaderProps";

export default function AdminDashboard() {
    const [allUsers, setAllUsers] = useState<HeaderProps["user"][]>([]);
    const [successMessage, setSuccessMessage] = useState<boolean>(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user.id === "0") { return }
        console.log(user.accountType)

        if (user.accountType !== 1){
            navigate("/");
        }

        fetch(`http://localhost:5110/user/getAllUsers`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
        }).then(async (res) => {
            if (!res.ok){
                const message =  await res.json()
                throw Error(`${res.status} - ${message.message}`);
            }
            return res.json()
        }).then(data => {
            setAllUsers(data["$values"]);
        }).catch(err => {
            handleError(err, navigate)
        })

    }, [navigate, user.accountType, user]);
    
    useEffect(() => {
        if (!successMessage) return;


        const timer = setTimeout(() => {
            setSuccessMessage(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage])


    function handleAdminChange() {
        
        fetch(`http://localhost:5110/user/updateAccountTypeForUsers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(allUsers.map(user => { return { Id: user.id, AccountType: user.accountType } }))
        }).then(async (res) => {
            if (!res.ok){
                throw Error("403 - You are not authorized to perform this action.");
            }
        }).then(() => {
            window.scrollTo(0, 0);
            setSuccessMessage(true);
        }
        ).catch(err => {
            handleError(err, navigate)
        })
    }


    function changeSelector(userId: string, value: string){

        const parsedType = Number(value);

        setAllUsers(prevUsers => {
            return prevUsers.map(currentUser => {
                if (currentUser.id === userId) {
                    return { ...currentUser, accountType: parsedType };
                }
                return currentUser;
            })
        });
    }

    return (

        <section className="admin-dashboard">
            {successMessage && (
                <div className="success-message">
                    <p>Account types updated successfully!</p>
                </div>
            )}

            <h1>Welcome to the Admin Dashboard, {user.name}!</h1>


            <h2>All Users</h2>
            <article className="table-container">
                <div className="table-headerMain">
                    <p>Acc. User ID</p>
                    <p>User Email</p>
                    <p>Account Type</p>
                </div>
                
                <section className="table-body">
                    {allUsers.map(currentUser => (
                        <div className="table-row"  key={currentUser.id}>
                            <p>{currentUser.id}</p>
                            <p>{currentUser.email}</p>



                            <select name="SelectUserType" value={currentUser.accountType} onChange={(e) => {changeSelector(currentUser.id, e.target.value)}} id="SelectUserType">
                               {user.id == currentUser.id && (
                                <option value={currentUser.accountType} disabled>Current User</option>
                               )}
                               {user.id != currentUser.id && (
                                <>
                                <option value="0">Regular User</option>
                                <option value="1">Admin</option>
                                </>
                               )}
                            </select>



                        </div>
                    ))}
                </section>

            </article>

            <section className="admin-dashboard-actions">
                <button onClick={() => {handleAdminChange()}}>Save</button>
                <button onClick={() => navigate("/")}>Back to Home</button>
            </section>

        </section>


    )


}