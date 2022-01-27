import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Host from "./components/Host/Host";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import PasswordRestore from "./components/PasswordRestore/PasswordRestore";
import useToken from "./useToken";
import { CurrentUserProvider } from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const { token, setToken } = useToken();
  if (!token) {
    return (
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login setToken={setToken} />} />
                <Route
                  path="/signup"
                  element={<Signup setToken={setToken} />}
                />
                <Route path="/password-restore" element={<PasswordRestore />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </div>
    );
  }
  return (
    <CurrentUserProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <NavBar setToken={setToken} />
                  <Home token={token} />
                </>
              }
            />
            <Route path="/Host" element={<Host token={token} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </CurrentUserProvider>
  );
}

export default App;
