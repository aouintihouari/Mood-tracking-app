import express from "express";

import {
  updateMe,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto,
  getMe,
  getDashboardStats,
} from "../controllers/user.controller.js";
import { createCheckIn } from "../controllers/checkIn.controller.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.use(protect);

router.get("/me", getMe);
router.get("/dashboard-stats", getDashboardStats);

router.patch("/updateMe", uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);
router.post("/checkIn", createCheckIn);

export default router;
