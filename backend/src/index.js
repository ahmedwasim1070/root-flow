import express, { application } from "express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";
import sysAdminRoute from "./routes/sysadmin.route.js";

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/auth/sys-admin", sysAdminRoute);

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
  connectDB();
});
