"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const data_source_1 = require("../data-source");
const Appointment_1 = require("../entities/Appointment");
class AppointmentController {
    constructor() {
        this.appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
    }
    all(_request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { customerId, veterinarianId, date } = _request.query;
                const where = {};
                if (customerId)
                    where.customer = { id: parseInt(customerId) };
                if (veterinarianId)
                    where.veterinarian = { id: parseInt(veterinarianId) };
                const findOptions = {
                    relations: ["customer", "pet", "veterinarian"]
                };
                if (Object.keys(where).length > 0) {
                    findOptions.where = where;
                }
                let appointments = yield this.appointmentRepository.find(findOptions);
                if (date && typeof date === 'string') {
                    const target = new Date(date);
                    appointments = appointments.filter((a) => {
                        const d = new Date(a.appointmentDate);
                        return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() && d.getDate() === target.getDate();
                    });
                }
                return response.json(appointments);
            }
            catch (error) {
                return response.status(500).json({ error: "Error fetching appointments" });
            }
        });
    }
    one(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const appointment = yield this.appointmentRepository.findOne({
                    where: { id },
                    relations: ["customer", "pet", "veterinarian"]
                });
                if (!appointment) {
                    return response.status(404).json({ error: "Appointment not found" });
                }
                return response.json(appointment);
            }
            catch (error) {
                return response.status(500).json({ error: "Error fetching appointment" });
            }
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { petId, customerId, veterinarianId, date, time, appointmentDate, reason, notes } = request.body;
                let appointmentDateObj = null;
                if (appointmentDate) {
                    appointmentDateObj = new Date(appointmentDate);
                }
                else if (date && time) {
                    appointmentDateObj = new Date(`${date}T${time}`);
                }
                const customerRepo = data_source_1.AppDataSource.getRepository("Customer");
                const petRepo = data_source_1.AppDataSource.getRepository("Pet");
                const userRepo = data_source_1.AppDataSource.getRepository("User");
                let customer = null;
                let pet = null;
                let veterinarian = null;
                if (customerId) {
                    customer = yield customerRepo.findOne({ where: { id: parseInt(customerId) } });
                    if (!customer)
                        return response.status(400).json({ error: "Customer not found" });
                }
                if (petId) {
                    pet = yield petRepo.findOne({ where: { id: parseInt(petId) } });
                    if (!pet)
                        return response.status(400).json({ error: "Pet not found" });
                }
                if (veterinarianId) {
                    veterinarian = yield userRepo.findOne({ where: { id: parseInt(veterinarianId) } });
                    if (!veterinarian)
                        return response.status(400).json({ error: "Veterinarian not found" });
                }
                const appointment = this.appointmentRepository.create({
                    appointmentDate: appointmentDateObj || new Date(),
                    reason: reason || request.body.reason || "",
                    status: request.body.status || 'SCHEDULED',
                    customer: customer || request.body.customer,
                    pet: pet || request.body.pet,
                    veterinarian: veterinarian || request.body.veterinarian,
                    notes: notes || request.body.notes || null,
                });
                const results = yield this.appointmentRepository.save(appointment);
                const saved = yield this.appointmentRepository.findOne({ where: { id: results.id }, relations: ["customer", "pet", "veterinarian"] });
                return response.json(saved);
            }
            catch (error) {
                return response.status(500).json({ error: "Error creating appointment" });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const appointment = yield this.appointmentRepository.findOneBy({ id });
                if (!appointment) {
                    return response.status(404).json({ error: "Appointment not found" });
                }
                this.appointmentRepository.merge(appointment, request.body);
                const results = yield this.appointmentRepository.save(appointment);
                return response.json(results);
            }
            catch (error) {
                return response.status(500).json({ error: "Error updating appointment" });
            }
        });
    }
    remove(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const appointment = yield this.appointmentRepository.findOneBy({ id });
                if (!appointment) {
                    return response.status(404).json({ error: "Appointment not found" });
                }
                yield this.appointmentRepository.remove(appointment);
                return response.json({ message: "Appointment deleted successfully" });
            }
            catch (error) {
                return response.status(500).json({ error: "Error deleting appointment" });
            }
        });
    }
}
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=AppointmentController.js.map