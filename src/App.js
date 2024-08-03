//contexts
import {AuthProvider} from "./context/AuthContext"

//pages
import Home from "./pages/Home"
import Shop from "./pages/Shop"

//routers
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/shop" element={<Shop/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
