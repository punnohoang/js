import express from "express";
import { StatisticsController } from "../controllers/StatisticsController";

const router = express.Router();
const controller = new StatisticsController();

router.get("/", controller.getStats.bind(controller));

export const statisticsRoutes = router;
