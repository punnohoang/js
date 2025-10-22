"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const InvoiceController_1 = require("../controllers/InvoiceController");
const router = express_1.default.Router();
const invoiceController = new InvoiceController_1.InvoiceController();
router.get("/", invoiceController.all.bind(invoiceController));
router.get("/:id", invoiceController.one.bind(invoiceController));
router.post("/", invoiceController.create.bind(invoiceController));
router.put("/:id", invoiceController.update.bind(invoiceController));
router.delete("/:id", invoiceController.remove.bind(invoiceController));
exports.invoiceRoutes = router;
//# sourceMappingURL=invoice.routes.js.map