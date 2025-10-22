import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { authRoutes } from "./routes/auth.routes";
import { customerRoutes } from "./routes/customer.routes";
import { petRoutes } from "./routes/pet.routes";
import { appointmentRoutes } from "./routes/appointment.routes";
import { userRoutes } from "./routes/user.routes";
import { invoiceRoutes } from "./routes/invoice.routes";
import { statisticsRoutes } from "./routes/statistics.routes";
import * as dotenv from "dotenv";

dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/statistics", statisticsRoutes);

// Initialize database connection
AppDataSource.initialize()
    .then(async () => {
        console.log("Database connection initialized");

        // Test database connection
        try {
            await AppDataSource.query('SELECT 1');
            console.log("Database connection test successful");
        } catch (error) {
            console.error("Database connection test failed:", error);
            process.exit(1);
        }

        // Start Express server
        const port = parseInt(process.env.PORT || "4000");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`API URL: http://localhost:${port}/api`);
        });
    })
    .catch(error => {
        console.error("Error during Data Source initialization:", error);
        process.exit(1);
    });