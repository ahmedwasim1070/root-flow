import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  checkUser,
  registerRoot,
  isRoot,
  signup,
  login,
  logout,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/check/user", protectRoute, checkUser);
router.post("/signup/root", registerRoot);
router.get("/checkRoot", isRoot);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;
