import { Route, Routes } from "react-router-dom"
import Home from "./components/Home/Home"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"


function App() {

  return (
    <div>
      <Header />
    
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>

      <Footer />
    </ div>
  )
}

export default App
