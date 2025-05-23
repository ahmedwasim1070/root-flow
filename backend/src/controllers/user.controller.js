import User from "../models/user.model.js";
import { createToken } from "../lib/utils.js";

// Verify user
export const checkUser = (req, res) => {
  try {
    return res
      .status(200)
      .json({ message: "Logged in though Token", user: req.user });
  } catch (error) {
    console.log("Error in checkUser controller : ", error);
    return res.status(500).json({ message: "Internel server error !" });
  }
};

// Signup's ROOT user
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
      return res.status(400).json({ message: "Invalid phone number !" });
    }

    if (password.length <= 8) {
      return res.status(400).json({ message: "Invalid password !" });
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

    const { password: _removed, ...safeUser } = newRoot._doc;

    console.log(`${newRoot.email} just got registered as root`);
    return res.status(200).json({
      message: "Root user registered successfully ! ",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error in registerRoot controller :", error);
    return res.status(500).json({ message: "Internel server error" });
  }
};

// Check's ROOT uesr
export const isRoot = async (req, res) => {
  try {
    const isRoot = await User.findOne({ role: "root" });
    if (!isRoot) {
      return res
        .status(404)
        .json({ message: "Root does not exsists", exsists: false });
    }

    return res
      .status(200)
      .json({ message: "Root user exsists", exsists: true });
  } catch (error) {
    console.error("Error in isRoot controller :", error);
    return res.status(500).json({ message: "Internel Server Error!" });
  }
};

export const signup = async (req, res) => {
  const { fullName, email, contactNumber, password, role, status } = req.body;
  try {
    if (!fullName || !email || !contactNumber || !password)
      return res
        .status(400)
        .json({ message: "All fields are required", isSignedUp: false });

    if (
      role === "root" ||
      ["active", "suspended", "inactive"].includes(status)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Request", isSignedUp: false });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{0,3})+$/;
    if (!emailRegex.test(email))
      return res
        .status(400)
        .json({ message: "Enter the valid Email", isSignedUp: false });

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "Email is already registered with one account",
        isSignedUp: false,
      });
    }

    const phoneRegex = /^\+?\d{10,14}$/;
    if (!phoneRegex.test(contactNumber)) {
      return res
        .status(400)
        .json({ message: "Invalid phone number !", isSignedUp: false });
    }

    if (password.length <= 8) {
      return res
        .status(400)
        .json({ message: "Invalid password !", isSignedUp: false });
    }

    const newUser = new User({
      fullName,
      email,
      contactNumber,
      password,
      role,
      status,
    });
    await newUser.save();

    console.log(`${newUser.email} just got registered as root`);
    return res.status(200).json({
      message: "Root user registered successfully ! ",
      isSignedUp: true,
    });
  } catch (error) {
    console.error("Error in registerRoot controller :", error);
    return res.status(500).json({ message: "Internel server error" });
  }
};

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

    const token = createToken(user._id, res);

    console.log(`${user.email} just logged in , ${user.role}`);
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error in Login Controller : ", error);
    return res.status(500).json({ message: "Internel Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("secret_key", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return res
      .status(200)
      .json({ message: "Logged out sucessfully", loggedOut: true });
  } catch (error) {
    console.error("Error in logout controller : ", error);
    return res.status(500).json({ message: "Internel Server error" });
  }
};

export const queryUser = async (req, res) => {
  const { permissions } = req.user.user;
  try {
    const users = await User.find({ role: { $in: permissions } }).select(
      "-password"
    );

    if (!users) {
      return res.status(404).json({ message: "No child user's in the system" });
    }

    return res.status(200).json({ message: "Querried user`s", users: users });
  } catch (error) {
    console.log("Error in queryUser controller ", error);
    return res.status(500).json({ message: "Internel server error" });
  }
};

export const updateUser = async (req, res) => {
  const { targetId, targetStatus } = req.body;
  if (
    !["approved", "pending", "rejected"].includes(targetStatus) ||
    !targetId
  ) {
    return res.status(400).json({ message: "Invalid request!" });
  }

  try {
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(400).json({ message: "User does not exsist`s" });
    }

    targetUser.status = targetStatus;
    await targetUser.save();

    return res
      .status(200)
      .json({ message: "User status updated successfully !" });
  } catch (error) {
    console.log("Error in updateUser controller", error);
    return res.status(500).json({ message: "Internel server error !" });
  }
};
