import { Router } from "express";
import { CustomerController } from "../controllers/CustomerController";

const router = Router();
const customerController = new CustomerController();

// Get all customers
router.get("/", customerController.all.bind(customerController));

// Get one customer
router.get("/:id", customerController.one.bind(customerController));

// Create a new customer
router.post("/", customerController.create.bind(customerController));

// Update a customer
router.put("/:id", customerController.update.bind(customerController));

// Delete a customer
router.delete("/:id", customerController.remove.bind(customerController));

export const customerRoutes = router;