import './App.css';
import {AuthProvider} from "./context/AuthContext"
import WardrobeUpload from "./components/WardrobeUpload"

function App() {
  return (
    <AuthProvider>
        <div className="App">
        <WardrobeUpload />
        </div>
    </AuthProvider>
  );
}

export default App;
