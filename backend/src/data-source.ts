import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "./entities/Customer";
import { Pet } from "./entities/Pet";
import { Appointment } from "./entities/Appointment";
import { MedicalRecord } from "./entities/MedicalRecord";
import { User } from "./entities/User";
import { Invoice } from "./entities/Invoice";
import { InvoiceItem } from "./entities/InvoiceItem";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "admin",
    password: process.env.DB_PASSWORD || "password123",
    database: process.env.DB_NAME || "vet_clinic",
    synchronize: true,
    logging: ["error", "warn", "info"],
    entities: [Customer, Pet, Appointment, MedicalRecord, User, Invoice, InvoiceItem],
    migrations: [],
    subscribers: [],
})