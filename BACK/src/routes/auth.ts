import { authenticate } from "../middleware/auth.js";
import { changePassword, getAuth, resetPassword, setNewPassword, signIn, signOut, signUp, updateProfile, verifyEmail } from "../controllers/auth.js";
import { Router } from "express";

const router = Router()

router.get("", getAuth)
router.post("/sign-in", signIn)
router.get("/sign-out", authenticate, signOut)
router.post("/sign-up", signUp)

router.post("/update-profile", authenticate, updateProfile)
router.post("/change-password", authenticate, changePassword)
router.post("/reset-password", resetPassword)
router.post("/set-new-password", setNewPassword)
router.post("/verify-email", verifyEmail)

export default router