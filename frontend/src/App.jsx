import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { checkRoot } from "./utils/checkRoot";
import { loginUser } from "./utils/loginUser";

import Home from "./pages/Home";
import RootSignup from "./pages/RootSignup";
import Login from "./pages/Login";

function App() {
  const apiRoute = import.meta.env.VITE_API_AUTH;

  const [isRoot, setIsRoot] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    checkRoot(apiRoute + "checkRoot", setIsRoot)
      .then((data) => {
        console.log(data.exsists, data.message);
      })
      .catch((error) => console.error("Fetch Failed : ", error));

    loginUser(apiRoute + "login", "null", setIsLogin);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={isRoot ? <Home /> : <Navigate to="/signup/root" />}
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
              isLogin ? (
                <Navigate to="/" />
              ) : (
                <Login apiRoute={apiRoute} setIsLogin={setIsLogin} />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
