import express from "express";
import {
  registerRoot,
  isRoot,
  signup,
  login,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup/root", registerRoot);
router.get("/checkRoot", isRoot);
router.post("/signup", signup);
router.post("/login", verifyToken, login);

export default router;
