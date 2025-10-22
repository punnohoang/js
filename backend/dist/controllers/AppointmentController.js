"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const data_source_1 = require("../data-source");
const Appointment_1 = require("../entities/Appointment");
class AppointmentController {
    constructor() {
        this.appointmentRepository = data_source_1.AppDataSource.getRepository(Appointment_1.Appointment);
    }
    async all(_request, response) {
        try {
            const appointments = await this.appointmentRepository.find({
                relations: ["customer", "pet", "veterinarian"]
            });
            return response.json(appointments);
        }
        catch (error) {
            return response.status(500).json({ error: "Error fetching appointments" });
        }
    }
    async one(request, response) {
        try {
            const id = parseInt(request.params.id);
            const appointment = await this.appointmentRepository.findOne({
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
    }
    async create(request, response) {
        try {
            const appointment = this.appointmentRepository.create(request.body);
            const results = await this.appointmentRepository.save(appointment);
            return response.json(results);
        }
        catch (error) {
            return response.status(500).json({ error: "Error creating appointment" });
        }
    }
    async update(request, response) {
        try {
            const id = parseInt(request.params.id);
            const appointment = await this.appointmentRepository.findOneBy({ id });
            if (!appointment) {
                return response.status(404).json({ error: "Appointment not found" });
            }
            this.appointmentRepository.merge(appointment, request.body);
            const results = await this.appointmentRepository.save(appointment);
            return response.json(results);
        }
        catch (error) {
            return response.status(500).json({ error: "Error updating appointment" });
        }
    }
    async remove(request, response) {
        try {
            const id = parseInt(request.params.id);
            const appointment = await this.appointmentRepository.findOneBy({ id });
            if (!appointment) {
                return response.status(404).json({ error: "Appointment not found" });
            }
            await this.appointmentRepository.remove(appointment);
            return response.json({ message: "Appointment deleted successfully" });
        }
        catch (error) {
            return response.status(500).json({ error: "Error deleting appointment" });
        }
    }
}
exports.AppointmentController = AppointmentController;
//# sourceMappingURL=AppointmentController.js.map