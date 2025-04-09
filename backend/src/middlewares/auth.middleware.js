import User from "../models/user.model.js";
import JWT from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies.secret_key;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = { user };
    next();
  } catch (error) {
    console.log("Error in protectRoute Middleware", error);
    res.status(500).json({ message: "Internel server error" });
  }
};
