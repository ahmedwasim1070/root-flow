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

function App() {
  const apiRoute = import.meta.env.VITE_API_AUTH;

  const [isRoot, setIsRoot] = useState(true);

  useEffect(() => {
    checkRoot(apiRoute + "checkRoot", setIsRoot)
      .then((data) => {
        console.log(data.exsists, data.message);
      })
      .catch((error) => console.error("Fetch Failed : ", error));
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
            element={<RootSignup apiRoute={apiRoute} setIsRoot={setIsRoot} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
