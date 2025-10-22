"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AppointmentController_1 = require("../controllers/AppointmentController");
const router = express_1.default.Router();
const appointmentController = new AppointmentController_1.AppointmentController();
router.get("/", appointmentController.all.bind(appointmentController));
router.get("/:id", appointmentController.one.bind(appointmentController));
router.post("/", appointmentController.create.bind(appointmentController));
router.put("/:id", appointmentController.update.bind(appointmentController));
router.delete("/:id", appointmentController.remove.bind(appointmentController));
exports.appointmentRoutes = router;
//# sourceMappingURL=appointment.routes.js.map