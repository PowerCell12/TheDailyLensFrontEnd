import { Link } from "react-router-dom"
import { HeaderProps } from "../../interfaces/HeaderProps"


export default function ProfilePageComponent({user, setUser} : HeaderProps){


    return (
        <section className="ProfilePageComponent">

            <aside>
                <h2>Account Managment</h2>

                <img  src="/PersonDefault.png" alt="" />

                <p className="ProfilePageComponentGreeting">Hello, {user.name}!</p>
                <form className="ProfilePageComponentForm" action="" method="post">
                    <label className="ProfilePageComponentLabelPassword">New Password</label>
                    <input type="password" placeholder={"*".repeat(8)} className="ProfilePageComponentPassword"/>
            
                    <button type="submit" className="ProfilePageComponentButton">Change Password</button>
                </form>
            
            
            </aside>


            <main >

                <h2>Profile Information</h2>

                <section className="ProfilePageProfileInformation">
                    <h5>Username</h5>
                    <p>{user.name}</p>

                    <h5>Full Name</h5>
                    <p>{user.fullName}</p>

                    <h5>Account Type</h5>
                    <p>{user.accountType}</p>

                    <h5>Country</h5>
                    <p>{user.country}</p>
                </section>


                <h3>Contact Info</h3>
                <h5>Email</h5>
                <p>{user.email}</p>


                <h3>About the User</h3>

                <h5>Bio</h5>
                <p>{user.bio}</p>

            </main>




        </section>
    )

}