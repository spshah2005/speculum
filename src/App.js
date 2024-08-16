//contexts
import {AuthProvider} from "./context/AuthContext"

//pages
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"
import Wardrobe from "./pages/Wardrobe"

//components
import AppNav from "./components/AppNav"
import WardrobeUpload from "./components/WardrobeUpload"
import PrivateRoute from "./components/PrivateRoute"
//routers
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

//drag and drop
import {DndProvider} from "react-dnd"
import {HTML5Backend} from 'react-dnd-html5-backend'

import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppNav />
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/wardrobe-upload" element={ <WardrobeUpload/>} />
          <Route path="/my-wardrobe" element={
            <PrivateRoute>
              <DndProvider backend={HTML5Backend}>
                <Wardrobe/>
              </DndProvider>
            </PrivateRoute>} />
          <Route path="/shop" element={<Shop/>} />
          <Route path="/log-in" element={<LogIn/>} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
