import { Link } from "react-router-dom"
import { HeaderProps } from "../../interfaces/HeaderProps"


export default function ProfilePageComponent({user, setUser} : HeaderProps){


    return (
        <section className="ProfilePageComponent">

            <aside className="ProfilePageAccountManagment">
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

                <h2 className="ProfilePageh2">Profile Information</h2>

                <section className="ProfilePageProfileInformation">
                    <article>
                        <h5>Username</h5>
                        <p>{user.name == user.email ? "N/A" : user.name}</p>
                    </article>

                    <article>
                        <h5>Full Name</h5>
                        <p>{user.fullName == null ? "N/A" : user.fullName}</p>
                    </article>

                </section>

                <section className="ProfilePageProfileInformation">
                    <article>
                        <h5>Account Type</h5>
                        <p>{user.accountType ? user.accountType : "N/A"}</p>
                    </article>

                    <article>
                        <h5>Country</h5>
                        <p>{user.country == null ? "N/A" : user.country}</p>
                    </article>

                </section>

                <h3 className="ProfilePageh3">Contact Info</h3>
                <h5 className="ProfilePageh5">Email</h5>
                <p className="ProfilePagep ProfilePageEmail">{user.email}</p>


                <h3 className="ProfilePageh3">About the User</h3>

                <h5 className="ProfilePageh5">Bio</h5>
                <p className="ProfilePagep ProfilePageBio">{user.bio == null ? "Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit tempora pariatur eius, totam quisquam dolore nisi eligendi illo eos temporibus itaque harum obcaecati recusandae eum quod nihil quos sequi sit!" : user.bio}</p>

            </main>

            <aside className="ProfilePageAccountSettings">
                <h2>Account Settings</h2>
                <section className="ProfilePageAccountSettingsSection">
                    <Link id="ProfilePageLinkEdit" to="/profile" className="ProfilePageLink">Edit Profile</Link>
                    <Link id="ProfilePageLinkDelete" to="/profile" className="ProfilePageLink">Delete Account</Link>
                </section>
            </aside>


        </section>
    )

}