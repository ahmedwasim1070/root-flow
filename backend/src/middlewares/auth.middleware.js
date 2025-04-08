import JWT from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies.secret_key;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.log("Error in protectRoute Middleware", error);
    res.status(500).json({ message: "Internel server error" });
  }
};
