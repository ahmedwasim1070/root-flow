import express, { application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import sysAdminRoute from "./routes/sysadmin.route.js";
import sudoRoute from "./routes/sudo.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/auth/sys-admin", sysAdminRoute);
app.use("/api/auth/sudo", sudoRoute);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
  connectDB();
});
