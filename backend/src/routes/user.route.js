import express from "express";
import { checkRoot, signup, login } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/checkRoot", checkRoot);
router.post("/signup", signup);
router.post("/login", login);

export default router;
