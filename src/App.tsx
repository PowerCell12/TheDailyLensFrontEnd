import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./components/Home/Home"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import RouteGuard from "./components/RouteGuard"
import ErrorPage from "./components/ErrorPage"
import ProfilePageComponent from "./components/ProfilePage/ProfilePageComponent"
import GuestGuard from "./components/GuestGuard"
import EditProfile from "./components/EditProfile/EditProfile"
import CreateBlog from "./components/CreateBlog/CreateBlog"
import BlogDetail from "./components/BlogDetail/BlogDetail"
import ShowComments from "./components/ShowComments/ShowComments.tsx"
import PostedBlogs from "./components/PostedBlogs/PostedBlogs.tsx"
import EditBlog from "./components/EditBlog/EditBlog.tsx"
import LikedBlogs from "./components/LikedBlogs/LikedBlogs.tsx"
import SearchComponent from "./components/SearchComponent/SearchComponent.tsx"
import { PostedComments } from "./components/PostedComments/PostedComments.tsx"
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.tsx"
import ResetPassword from "./components/ResetPassword/ResetPassword.tsx"
import PrivacyTerms from "./components/PrivacyTermsComponent/PrivacyTerms.tsx"
import AuthCallback from "./components/AuthCallback/AuthCallback.tsx"


function App(){

    return (
      <div>
        <Header />
      
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/error/:code/:message" element={<ErrorPage />}/>
          <Route path="*" element={<Navigate to="/error/404/Page%20Not%20Found" />} />
          <Route path="/blog/:id" element={<BlogDetail  />}/>
          <Route path="/results" element={<SearchComponent  />}/>
          <Route path="/resetPassword/:email" element={<ResetPassword />}/>
          <Route path="/terms-of-service" element={< PrivacyTerms /> } />
          <Route path="/auth-callback" element={< AuthCallback />}/>

          <Route  element={<RouteGuard />}>
            <Route path="/profile/:username" element={<ProfilePageComponent />}/>
            <Route path="/:username/postedComments" element={<PostedComments /> } /> 
            <Route path="/profile/:username/edit" element={<EditProfile />}/>
            <Route path="/createBlog" element={<CreateBlog />}/>
            <Route path="/blog/:id/comments" element={<ShowComments />}/>
            <Route path="/:username/postedBlogs" element={<PostedBlogs /> }/>
            <Route path="/blog/:id/edit" element={<EditBlog />}/>
            <Route path="/:username/likedBlogs" element={<LikedBlogs />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
 
          <Route element={<GuestGuard />}>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
          </Route>

        </Routes>

        <Footer />
      </ div>
    )
}

export default App
