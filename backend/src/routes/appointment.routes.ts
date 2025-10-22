import express from "express";
import { AppointmentController } from "../controllers/AppointmentController";

const router = express.Router();
const appointmentController = new AppointmentController();

// Get all appointments
router.get("/", appointmentController.all.bind(appointmentController));

// Get one appointment
router.get("/:id", appointmentController.one.bind(appointmentController));

// Create a new appointment
router.post("/", appointmentController.create.bind(appointmentController));

// Update an appointment
router.put("/:id", appointmentController.update.bind(appointmentController));

// Delete an appointment
router.delete("/:id", appointmentController.remove.bind(appointmentController));

export const appointmentRoutes = router;