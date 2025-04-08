import React, { StrictMode, useState } from "react";
import cookie from "js-cookie";

import { loginUser } from "../utils/loginUser";

function Login({ apiRoute, setIsLogin }) {
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
      loginUser(apiRoute + "login", formData, setIsLogin)
        .then((data) => {
          console.log(data);

          cookie.set("secret_key", data.token, {
            expires: 7,
            sameSite: "strict",
            secure: import.meta.env.VITE_IS_DEVELOPMENT !== "development",
          });

          setFormData({
            email: "",
            password: "",
          });
        })
        .catch((error) => {
          console.error("Error in API : ", error);
        });
    }
  };

  return (
    <>
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

            <button
              type="submit"
              disabled={disableSubmit}
              className="btn btn-neutral mt-4"
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
