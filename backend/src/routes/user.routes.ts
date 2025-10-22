import express from "express";
import { UserController } from "../controllers/UserController";

const router = express.Router();
const userController = new UserController();

// Get all users
router.get("/", userController.all.bind(userController));

// Get one user
router.get("/:id", userController.one.bind(userController));

// Create a new user
router.post("/", userController.create.bind(userController));

// Update a user
router.put("/:id", userController.update.bind(userController));

// Delete a user
router.delete("/:id", userController.remove.bind(userController));

export const userRoutes = router;