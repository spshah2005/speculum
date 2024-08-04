//contexts
import {AuthProvider} from "./context/AuthContext"

//pages
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"

//components
import AppNav from "./components/AppNav"
import WardrobeUpload from "./components/WardrobeUpload"

//routers
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  return (
    <AuthProvider>
      <AppNav />
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/wardrobe-upload" element={<WardrobeUpload/>} />
          <Route path="/shop" element={<Shop/>} />
          <Route path="/log-in" element={<LogIn/>} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
