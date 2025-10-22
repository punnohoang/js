import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Appointment } from "../entities/Appointment";

export class AppointmentController {
    private appointmentRepository = AppDataSource.getRepository(Appointment);

    async all(_request: Request, response: Response) {
        try {
            const appointments = await this.appointmentRepository.find({
                relations: ["customer", "pet", "veterinarian"]
            });
            return response.json(appointments);
        } catch (error) {
            return response.status(500).json({ error: "Error fetching appointments" });
        }
    }

    async one(request: Request, response: Response) {
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
        } catch (error) {
            return response.status(500).json({ error: "Error fetching appointment" });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const appointment = this.appointmentRepository.create(request.body);
            const results = await this.appointmentRepository.save(appointment);
            return response.json(results);
        } catch (error) {
            return response.status(500).json({ error: "Error creating appointment" });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const appointment = await this.appointmentRepository.findOneBy({ id });

            if (!appointment) {
                return response.status(404).json({ error: "Appointment not found" });
            }

            this.appointmentRepository.merge(appointment, request.body);
            const results = await this.appointmentRepository.save(appointment);
            return response.json(results);
        } catch (error) {
            return response.status(500).json({ error: "Error updating appointment" });
        }
    }

    async remove(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const appointment = await this.appointmentRepository.findOneBy({ id });

            if (!appointment) {
                return response.status(404).json({ error: "Appointment not found" });
            }

            await this.appointmentRepository.remove(appointment);
            return response.json({ message: "Appointment deleted successfully" });
        } catch (error) {
            return response.status(500).json({ error: "Error deleting appointment" });
        }
    }
}