import User from "../models/user.model.js";
import { generateToken } from "../lib/util.js";

export const signup = async (req, res) => {
  try {
    const devUser = await User.findOne({ role: "root" });

    if (!devUser) {
      const defautlDeveloper = new User({
        fullName: "David Snowden",
        email: "davidsnowden911@gmail.com",
        contactNumber: "19182283675",
        password: "lasdjkflasj123",
        role: "root",
        status: "active",
      });

      defautlDeveloper.save();
      return res.status(200).json({ message: "Root user created sucessfully" });
    }

    res.status(200).json({ message: "Root user already exsists" });
  } catch (error) {
    res.status(500).json({ message: "Internel Server Error" });
    console.log("Error in Sys-Admin signup Controller : ", { error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Credentials check your Email or Password" });
    } else {
      const isPassword = user.comparePassword(password);

      if (!isPassword) {
        return res.status(401).json({
          message: "Invalid Credentials check your Email or Password",
        });
      }

      const token = generateToken(user, res);

      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).json({ message: "Internel Server Error ! " });
    console.log(`Error in SYS_ADMIN Login controller : ${error}`);
  }
};
