import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
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
import CreateBlog from "./components/CreateBlog/CreateBlog"
import BlogDetail from "./components/BlogDetail/BlogDetail"
import  handleError  from "./utils/handleError.ts"
import ShowComments from "./components/ShowComments/ShowComments.tsx"
import { HeaderProps } from "./interfaces/HeaderProps.ts"
import PostedBlogs from "./components/PostedBlogs/PostedBlogs.tsx"


function App() {
    const [user , setUser] = useState<HeaderProps["user"]>({"name": "defaultName", "email": "", "accountType": "Basic User", "imageUrl": "/PersonDefault.png", "bio": "", "country": "", "fullName": "", id: 0, likedComments: [], dislikedComments: []});
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

              let imageUrl = "";
              if (data.imageUrl == "/PersonDefault.png" || data.imageUrl == null || data.imageUrl == undefined || data.imageUrl == ""){
                imageUrl = "/PersonDefault.png"
              }else imageUrl = `http://localhost:5110/${data.imageUrl}`

              setUser({name: data.name, email: data.email, accountType: data.accountType, country: data.country, fullName: data.fullName, imageUrl:  imageUrl, bio: data.bio, id: data.id, likedComments: data.likedComments["$values"], dislikedComments: data.dislikedComments["$values"]});
          }).catch(err =>  {
            handleError(err, navigate)
          }) 
  
          
      }, [user, navigate]);


    return (
      <div>
        <Header user={user} setUser={setUser} />
      
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/error/:code/:message" element={<ErrorPage />}/>
          <Route path="*" element={<Navigate to="/error/404/Page%20Not%20Found" />} />
          <Route path="/blog/:id" element={<BlogDetail user={user} setUser={setUser} />}/>

          <Route  element={<RouteGuard />}>
            <Route path="/profile" element={<ProfilePageComponent user={user} setUser={setUser} />}/>
            <Route path="/profile/edit" element={<EditProfile user={user} setUser={setUser } />}/>
            <Route path="/createBlog" element={<CreateBlog />}/>
            <Route path="/blog/:id/comments" element={<ShowComments user={user} setUser={setUser}/>}/>
            <Route path="/:userName/postedBlogs" element={<PostedBlogs user={user} setUser={setUser} /> }/>
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
