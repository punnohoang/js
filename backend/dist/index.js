"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const auth_routes_1 = require("./routes/auth.routes");
const customer_routes_1 = require("./routes/customer.routes");
const pet_routes_1 = require("./routes/pet.routes");
const appointment_routes_1 = require("./routes/appointment.routes");
const user_routes_1 = require("./routes/user.routes");
const invoice_routes_1 = require("./routes/invoice.routes");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.authRoutes);
app.use("/api/customers", customer_routes_1.customerRoutes);
app.use("/api/pets", pet_routes_1.petRoutes);
app.use("/api/appointments", appointment_routes_1.appointmentRoutes);
app.use("/api/users", user_routes_1.userRoutes);
app.use("/api/invoices", invoice_routes_1.invoiceRoutes);
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database connection initialized");
    try {
        yield data_source_1.AppDataSource.query('SELECT 1');
        console.log("Database connection test successful");
    }
    catch (error) {
        console.error("Database connection test failed:", error);
        process.exit(1);
    }
    const port = parseInt(process.env.PORT || "4000");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`API URL: http://localhost:${port}/api`);
    });
}))
    .catch(error => {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map