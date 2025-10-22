import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const authController = new AuthController();

// Register route
router.post("/register", authController.register.bind(authController));

// Login route
router.post("/login", authController.login.bind(authController));

// Current user
router.get("/me", authController.me.bind(authController));

export const authRoutes = router;