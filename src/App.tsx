import { Route, Routes } from "react-router-dom"
import Home from "./components/Home/Home"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import RouteGuard from "./components/RouteGuard"
import ErrorPage from "./components/ErrorPage"
import ProfilePageComponent from "./components/ProfilePage/ProfilePageComponent"
import { useState } from "react"
import GuestGuard from "./components/GuestGuard"


function App() {
  const [user , setUser] = useState({"name": "defaultName", "email": "", "accountType": "Basic User", "image": "", "bio": "", "country": "", "fullName": ""});

  return (
    <div>
      <Header user={user} setUser={setUser} />
    
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/error" element={<ErrorPage />}/>

        <Route  element={<RouteGuard />}>
          <Route path="/profile" element={<ProfilePageComponent user={user} setUser={setUser} />}/>
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
