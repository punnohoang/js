"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petRoutes = void 0;
const express_1 = require("express");
const PetController_1 = require("../controllers/PetController");
const router = (0, express_1.Router)();
const petController = new PetController_1.PetController();
router.get("/", petController.all.bind(petController));
router.get("/:id", petController.one.bind(petController));
router.post("/", petController.create.bind(petController));
router.put("/:id", petController.update.bind(petController));
router.delete("/:id", petController.remove.bind(petController));
exports.petRoutes = router;
//# sourceMappingURL=pet.routes.js.map