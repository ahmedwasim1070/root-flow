import User from "../models/user.model.js";
import { createToken } from "../lib/utils.js";

export const checkRoot = async (req, res) => {
  try {
    const user = await User.findOne({ role: "root" });
    if (!user) {
      return res
        .status(404)
        .json({ exsists: false, message: "Root does not exsists" });
    }
    return res
      .status(200)
      .json({ exsists: true, message: "Root user exsists" });
  } catch (error) {
    console.error("Error in checkRoot controller :", error);
    return res.status(500).json({ message: "Internel Server Error!" });
  }
};

export const signup = (req, res) => {};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "All Fields are required !" });

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Enter the valid Email" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exsists" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const payload = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    const token = createToken(payload, res);

    res.status(200).json({ message: "Login successful", token, user: payload });
    console.log(`${user.email} just logged in`);
  } catch (error) {
    res.status(500).json({ message: "Internel Server error" });
    console.log(`Error in Login Controller : ${error}`);
  }
};

// const regRoot = async (res) => {
//   try {
//     const regRoot = await User.findOne({ role: "root" });
//     if (!regRoot) {
//       const rootUserPayload = {
//         fullName: "David Snowden",
//         email: "davidsnowden911@gmail.com",
//         contactNumber: "19182283675",
//         password: "qwerty123",
//         role: "root",
//         status: "active",
//       };

//       const rootUser = new User(rootUserPayload);
//       rootUser.save();
//       return res.status(200).json({ message: "Root user initialized ! " });
//     }
//     res.status(200).json({ message: "Root User already exsists" });
//   } catch (error) {
//     res.status(500).json({ message: "Internel Server Errror" });
//     console.log(`Error during registering root user ${error}`);
//   }
// };
