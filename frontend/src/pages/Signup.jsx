import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signupUser } from "../utils/signupUser.js";

function Signup({ apiRoute }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [disableSubmit, setDisableSubmit] = useState(false);

  const [errorForm, setErrorForm] = useState({
    fullName: false,
    email: false,
    contactNumber: false,
    password: false,
    confirmPassword: false,
  });

  const hanldeChange = (e) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === "fullName") {
      if (targetValue.length < 2 || targetValue.length > 42) {
        setErrorForm({ ...errorForm, [targetName]: true });
        setDisableSubmit(true);
      } else {
        setErrorForm({ ...errorForm, [targetName]: false });
        setDisableSubmit(false);
      }
    }

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

    if (targetName === "contactNumber") {
      const phoneRegex = /^\+?\d{10,14}$/;
      if (!phoneRegex.test(targetValue)) {
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

    if (targetName === "confirmPassword") {
      if (targetValue !== formData.password) {
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
      signupUser(apiRoute + "signup", formData)
        .then((data) => {
          setFormData({
            fullName: "",
            email: "",
            contactNumber: "",
            password: "",
            confirmPassword: "",
          });
          navigate("/login");
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
            <legend className="fieldset-legend">Root Signup</legend>

            <label className="fieldset-label">
              {errorForm.fullName
                ? "Name should be atleast 2 to 42 characters"
                : "Full name"}
            </label>
            <input
              value={formData.fullName}
              onChange={(e) => {
                hanldeChange(e);
              }}
              name="fullName"
              type="text"
              className={`input ${errorForm.fullName && `border-red-700`}`}
              placeholder="Name"
            />

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
              {errorForm.contactNumber
                ? "Enter a valid phone"
                : "Contact number"}
            </label>
            <input
              value={formData.contactNumber}
              onChange={(e) => {
                hanldeChange(e);
              }}
              name="contactNumber"
              type="tel"
              className={`input ${errorForm.contactNumber && `border-red-700`}`}
              placeholder="Phone"
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

            <label className="fieldset-label">
              {errorForm.confirmPassword
                ? "Password does not match"
                : "Confirm password"}
            </label>
            <input
              value={formData.confirmPassword}
              onChange={(e) => {
                hanldeChange(e);
              }}
              name="confirmPassword"
              type="password"
              className={`input ${
                errorForm.confirmPassword && `border-red-700`
              }`}
              placeholder="Confirm Password"
            />

            <button
              type="submit"
              disabled={disableSubmit}
              className="btn btn-neutral mt-4"
            >
              Signup
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default Signup;
