
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom"
import LoginPage from "./components/LoginPage";
import MainPage from "./components/mainPage";
import Profile from "./components/Profile";
import {useEffect} from "react";
import store from "./reducers";
import {registerUser} from "./actions/actions";


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
