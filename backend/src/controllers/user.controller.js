import User from "../models/user.model.js";
import { createToken } from "../lib/utils.js";

export const registerRoot = async (req, res) => {
  const { fullName, email, contactNumber, password, role, status } = req.body;
  try {
    if (!fullName || !email || !contactNumber || !password || !role || !status)
      return res.status(400).json({ message: "All fields are required" });

    const isRoot = await User.findOne({ role });
    if (isRoot)
      return res.status(409).json({ message: "Root user already exsist's" });

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Enter the valid Email" });

    const root = await User.findOne({ email });
    if (root) {
      return res
        .status(409)
        .json({ message: "Email is already registered with one account" });
    }
    const phoneRegex = /^\+?\d{10,14}$/;
    if (!phoneRegex.test(contactNumber)) {
      res.status(400).json({ message: "Invalid phone number !" });
    }

    if (!password.length <= 8) {
      res.status(400).json({ message: "Invalid password !" });
    }

    const newRoot = new User({
      fullName,
      email,
      contactNumber,
      password,
      role,
      status,
    });
    await newRoot.save();

    const payload = {
      id: newRoot._id,
      fullName: newRoot.fullName,
      email: newRoot.email,
      role: newRoot.role,
    };

    const token = createToken(payload, res);

    return res.status(200).json({
      message: "Root user registered successfully ! ",
      token,
      user: payload,
    });
  } catch (error) {
    console.error("Error in registerRoot controller :", error);
    return res.status(500).json({ message: "Internel server error" });
  }
};

export const checkRoot = async (res) => {
  try {
    const isRoot = await User.findOne({ role: "root" });
    if (!isRoot) {
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

    console.log(`${user.email} just logged in`);
    return res
      .status(200)
      .json({ message: "Login successful", token, user: payload });
  } catch (error) {
    console.error("Error in Login Controller : ", error);
    return res.status(500).json({ message: "Internel Server error" });
  }
};
