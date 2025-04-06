import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import userRoute from "./routes/user.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/auth", userRoute);

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
  connectDB();
});
