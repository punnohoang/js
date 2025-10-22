"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Customer_1 = require("./entities/Customer");
const Pet_1 = require("./entities/Pet");
const Appointment_1 = require("./entities/Appointment");
const MedicalRecord_1 = require("./entities/MedicalRecord");
const User_1 = require("./entities/User");
const Invoice_1 = require("./entities/Invoice");
const InvoiceItem_1 = require("./entities/InvoiceItem");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "admin",
    password: process.env.DB_PASSWORD || "password123",
    database: process.env.DB_NAME || "vet_clinic",
    synchronize: true,
    logging: true,
    entities: [Customer_1.Customer, Pet_1.Pet, Appointment_1.Appointment, MedicalRecord_1.MedicalRecord, User_1.User, Invoice_1.Invoice, InvoiceItem_1.InvoiceItem],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map