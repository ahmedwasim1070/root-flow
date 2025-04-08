import JWT from "jsonwebtoken";

export const createToken = (payload, res) => {
  const token = JWT.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("secret_key", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

