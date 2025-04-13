import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  checkUser,
  registerRoot,
  isRoot,
  signup,
  login,
  logout,
  queryUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/check/user", protectRoute, checkUser);
router.post("/signup/root", registerRoot);
router.get("/checkRoot", isRoot);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/queryUser", protectRoute, queryUser);
router.post("/updateUser", protectRoute, updateUser);

export default router;
