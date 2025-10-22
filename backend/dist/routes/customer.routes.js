"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = void 0;
const express_1 = require("express");
const CustomerController_1 = require("../controllers/CustomerController");
const router = (0, express_1.Router)();
const customerController = new CustomerController_1.CustomerController();
router.get("/", customerController.all.bind(customerController));
router.get("/:id", customerController.one.bind(customerController));
router.post("/", customerController.create.bind(customerController));
router.put("/:id", customerController.update.bind(customerController));
router.delete("/:id", customerController.remove.bind(customerController));
exports.customerRoutes = router;
//# sourceMappingURL=customer.routes.js.map