import { Router } from "express";
import { PetController } from "../controllers/PetController";

const router = Router();
const petController = new PetController();

// Get all pets
router.get("/", petController.all.bind(petController));

// Get one pet
router.get("/:id", petController.one.bind(petController));

// Create a new pet
router.post("/", petController.create.bind(petController));

// Update a pet
router.put("/:id", petController.update.bind(petController));

// Delete a pet
router.delete("/:id", petController.remove.bind(petController));

export const petRoutes = router;