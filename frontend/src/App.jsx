import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { checkRoot } from "./utils/checkRoot";
import { checkAuth } from "./utils/checkAuth";

import Home from "./pages/Home";
import RootSignup from "./pages/RootSignup";
import Login from "./pages/Login";
import Logout from "./pages/Logout";

function App() {
  const apiRoute = import.meta.env.VITE_API_AUTH;

  const [isRoot, setIsRoot] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    checkRoot(apiRoute + "checkRoot", setIsRoot)
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => console.error("Fetch Failed : ", error));

    checkAuth(apiRoute + "check/user", setIsLoggedIn, setAuthUser)
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => console.error("Fetch Failed from checkAuth : ", error));
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isRoot ? (
                isLoggedIn ? (
                  <Home authUser={authUser} />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/signup/root" />
              )
            }
          />
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
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login
                  apiRoute={apiRoute}
                  setAuthUser={setAuthUser}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )
            }
          />
          <Route
            path="/logout"
            element={
              isLoggedIn ? (
                <Logout
                  apiRoute={apiRoute}
                  setIsLoggedIn={setIsLoggedIn}
                  setAuthUser={setAuthUser}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
