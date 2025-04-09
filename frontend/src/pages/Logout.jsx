import React, { useEffect } from "react";

import { logoutUser } from "../utils/logoutUser";

function Logout({ apiRoute, setIsLoggedIn, setAuthUser }) {
  useEffect(() => {
    logoutUser(apiRoute + "logout", setIsLoggedIn, setAuthUser)
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error(`Error in API : ${error}`);
      });
  }, []);
  return (
    <>
      <div>Logout</div>
    </>
  );
}

export default Logout;
