import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { checkRoot } from "./utils/checkRoot";

import Home from "./pages/Home";
import RootSignup from "./pages/RootSignup";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Signup from "./pages/Signup";

function App() {
  const apiRoute = import.meta.env.VITE_API_AUTH;

  const [isRoot, setIsRoot] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    checkRoot(apiRoute + "checkRoot", setIsRoot)
      .then((data) => {
        if (data.exsists) {
          setIsRoot(data.exsists);
          console.log(`Root user exists : ${data.exsists}`);
        }
      })
      .catch((error) => console.error("Fetch Failed : ", error));
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* Home Route - Only accessible if isRoot and isLoggedIn */}
          <Route
            path="/"
            element={
              isRoot ? (
                isLoggedIn ? (
                  <Home apiRoute={apiRoute} authUser={authUser} />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/signup/root" />
              )
            }
          />

          {/* Root Signup - Only accessible if NOT isRoot */}
          <Route
            path="/signup/root"
            element={
              isRoot ? (
                <Navigate to="/" />
              ) : (
                <RootSignup apiRoute={apiRoute} setIsRoot={setIsRoot} />
              )
            }
          />

          {/* Login - Only accessible if isRoot */}
          <Route
            path="/login"
            element={
              isRoot ? (
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Login
                    apiRoute={apiRoute}
                    setAuthUser={setAuthUser}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                )
              ) : (
                <Navigate to="/signup/root" />
              )
            }
          />

          {/* Signup - Only accessible if isRoot */}
          <Route
            path="/signup"
            element={
              isRoot ? (
                isLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <Signup apiRoute={apiRoute} />
                )
              ) : (
                <Navigate to="/signup/root" />
              )
            }
          />

          {/* Logout - Only accessible if isRoot and isLoggedIn */}
          <Route
            path="/logout"
            element={
              isRoot ? (
                isLoggedIn ? (
                  <Logout
                    apiRoute={apiRoute}
                    setIsLoggedIn={setIsLoggedIn}
                    setAuthUser={setAuthUser}
                  />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/signup/root" />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
