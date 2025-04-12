import { Route, Routes, useNavigate } from "react-router-dom"
import Home from "./components/Home/Home"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import RouteGuard from "./components/RouteGuard"
import ErrorPage from "./components/ErrorPage"
import ProfilePageComponent from "./components/ProfilePage/ProfilePageComponent"
import { useEffect, useState } from "react"
import GuestGuard from "./components/GuestGuard"
import EditProfile from "./components/EditProfile/EditProfile"
import { fetchUserInfo } from "./services/AuthService"


function App() {
    const [user , setUser] = useState({"name": "defaultName", "email": "", "accountType": "Basic User", "imageUrl": "", "bio": "", "country": "", "fullName": ""});
    const navigate = useNavigate()

    useEffect(() => {
          const token = localStorage.getItem("authToken");
  
          if (token === null || token === undefined || token === "") {
              return;
          }
  
          fetchUserInfo().then(data => {
              if (data.name == user.name && data.email == user.email){
                  return;
              }
              
              setUser({name: data.name, email: data.email, accountType: data.accountType, country: data.country, fullName: data.fullName, imageUrl:  `http://localhost:5110/${data.imageUrl}`, bio: data.bio});
          }).catch(err =>  {
              const status = err.message.split(" - ")[0]
              const statusText = err.message.split(" - ")[1]
              navigate("/error", {
                  state: {
                      code: status || 500,
                      message: statusText || "Network Error"
                  }  
              })
          }) 
  
          
      }, [user, navigate]);

``
    return (
      <div>
        <Header user={user} setUser={setUser} />
      
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/error" element={<ErrorPage />}/>

          <Route  element={<RouteGuard />}>
            <Route path="/profile" element={<ProfilePageComponent user={user} setUser={setUser} />}/>
            <Route path="/profile/edit" element={<EditProfile user={user} setUser={setUser } />}/>
          </Route>

          <Route element={<GuestGuard />}>
            <Route path="/login" element={<Login user={user} setUser={setUser} />}/>
            <Route path="/register" element={<Register user={user} setUser={setUser} />}/>
          </Route>

        </Routes>

        <Footer />
      </ div>
    )
}

export default App
