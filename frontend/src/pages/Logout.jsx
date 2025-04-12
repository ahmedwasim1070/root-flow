import React, { useEffect } from "react";
import { toast } from "react-hot-toast";

import { logoutUser } from "../utils/logoutUser";

function Logout({ apiRoute, setIsLoggedIn, setAuthUser }) {
  useEffect(() => {
    logoutUser(apiRoute + "logout")
      .then((data) => {
        if (data.loggedOut) {
          setIsLoggedIn(!data.loggedOut);
          toast.success("Succesfully Logged Out");
          setAuthUser({});

          console.log(`Logout process is , ${data.loggedOut}`);
        }
      })
      .catch((error) => {
        console.error(`Error in API : ${error}`);
      });
  }, []);
  return <></>;
}

export default Logout;
