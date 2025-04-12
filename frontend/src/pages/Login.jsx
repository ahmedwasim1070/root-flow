import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../utils/loginUser";
import { checkAuth } from "../utils/checkAuth";

function Login({ apiRoute, setAuthUser, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [disableSubmit, setDisableSubmit] = useState(false);

  const [errorForm, setErrorForm] = useState({
    email: false,
    password: false,
  });

  const hanldeChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === "email") {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
      if (!emailRegex.test(targetValue)) {
        setErrorForm({ ...errorForm, [targetName]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
        setDisableSubmit(false);
      }
    }

    if (targetName === "password") {
      if (targetValue.length <= 8) {
        setErrorForm({ ...errorForm, [targetName]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
        setDisableSubmit(false);
      }
    }

    setFormData({ ...formData, [targetName]: targetValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (disableSubmit != true) {
      loginUser(apiRoute + "login", formData)
        .then((data) => {
          if (data.token) {
            checkAuth(apiRoute + "check/user", setIsLoggedIn, setAuthUser)
              .then((data) => {
                toast.success("Logged in Sucessfully !");
              })
              .catch((error) =>
                console.error("Fetch Failed from checkAuth : ", error)
              );

            setFormData({
              email: "",
              password: "",
            });

            navigate("/");
            console.log(`Login process is , ${data.token !== undefined}`);
          }
        })
        .catch((error) => {
          console.error("Error in API : ", error);
        });
    }
  };

  useEffect(() => {
    checkAuth(apiRoute + "check/user", setIsLoggedIn, setAuthUser)
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => console.error("Fetch Failed from checkAuth : ", error));
  }, []);

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div className="h-[100vh] flex items-center justify-center">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="fieldset-legend">Login</legend>

            <label className="fieldset-label">
              {errorForm.email ? "Enter a valid email" : "Email"}
            </label>
            <input
              value={formData.email}
              onChange={(e) => {
                hanldeChange(e);
              }}
              name="email"
              type="email"
              className={`input ${errorForm.email && `border-red-700`}`}
              placeholder="Email"
            />

            <label className="fieldset-label">
              {errorForm.password
                ? "Password should be atleast 8 characters"
                : "Password"}
            </label>
            <input
              value={formData.password}
              onChange={(e) => {
                hanldeChange(e);
              }}
              name="password"
              type="password"
              className={`input ${errorForm.password && `border-red-700`}`}
              placeholder="Password"
            />
            <div className="text-center py-1">
              <p className="text-accent">
                Register ?{" "}
                <Link
                  className="text-secondary underline px-1 font-bold"
                  to="/signup"
                >
                  Signup here
                </Link>
                .
              </p>
            </div>

            <button
              type="submit"
              disabled={disableSubmit}
              className="btn btn-primary duration-75 hover:btn-neutral mt-4"
            >
              Login
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default Login;
