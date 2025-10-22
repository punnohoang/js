import express from "express";
import { InvoiceController } from "../controllers/InvoiceController";

const router = express.Router();
const invoiceController = new InvoiceController();

// Get all invoices
router.get("/", invoiceController.all.bind(invoiceController));

// Get one invoice
router.get("/:id", invoiceController.one.bind(invoiceController));

// Create a new invoice
router.post("/", invoiceController.create.bind(invoiceController));

// Update an invoice
router.put("/:id", invoiceController.update.bind(invoiceController));

// Delete an invoice
router.delete("/:id", invoiceController.remove.bind(invoiceController));

export const invoiceRoutes = router;