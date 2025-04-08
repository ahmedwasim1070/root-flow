import JWT from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.secret_key;

    if (!token) {
      next();
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
  } catch (error) {}
};
