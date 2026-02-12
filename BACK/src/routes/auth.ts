import { authenticate } from "../middleware/auth.js";
import * as authController from "../controllers/auth.js";
import { Router } from "express";

const router = Router()

router.get("", authController.getAuth)
router.post("/sign-in", authController.signIn)
router.get("/sign-out", authenticate, authController.signOut)
router.post("/sign-up", authController.signUp)
router.post("/update-profile", authenticate, authController.updateProfile)
router.post("/change-password", authenticate, authController.changePassword)
router.post("/reset-password", authController.resetPassword)
router.post("/set-new-password", authController.setNewPassword)
router.post("/verify-email", authController.verifyEmail)

export default router