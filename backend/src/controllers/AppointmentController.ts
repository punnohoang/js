import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Appointment } from "../entities/Appointment";

export class AppointmentController {
    private appointmentRepository = AppDataSource.getRepository(Appointment);

    async all(_request: Request, response: Response) {
        try {
            const { customerId, veterinarianId, date } = _request.query;

            const where: any = {};
            if (customerId) where.customer = { id: parseInt(customerId as string) };
            if (veterinarianId) where.veterinarian = { id: parseInt(veterinarianId as string) };

            const findOptions: any = {
                relations: ["customer", "pet", "veterinarian"]
            };

            if (Object.keys(where).length > 0) {
                findOptions.where = where;
            }

            let appointments = await this.appointmentRepository.find(findOptions);

            // If date filter provided, filter by same-day appointmentDate
            if (date && typeof date === 'string') {
                const target = new Date(date);
                appointments = appointments.filter((a) => {
                    const d = new Date(a.appointmentDate);
                    return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth() && d.getDate() === target.getDate();
                });
            }
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
            // Accept flexible payloads from frontend: either full appointment object or { petId, customerId, date, time, reason }
            const { petId, customerId, veterinarianId, date, time, appointmentDate, reason, notes } = request.body as any;

            let appointmentDateObj: Date | null = null;
            if (appointmentDate) {
                appointmentDateObj = new Date(appointmentDate);
            } else if (date && time) {
                // combine date and time (assume local)
                appointmentDateObj = new Date(`${date}T${time}`);
            }

            // If front-end sent related ids, load relations
            const customerRepo = AppDataSource.getRepository("Customer");
            const petRepo = AppDataSource.getRepository("Pet");
            const userRepo = AppDataSource.getRepository("User");

            let customer: any = null;
            let pet: any = null;
            let veterinarian: any = null;

            if (customerId) {
                const cid = parseInt(customerId)
                customer = await customerRepo.findOne({ where: { id: cid } });

                // If no Customer found, the frontend might have sent a User id (account) for a customer role.
                // Try to resolve by user id -> find existing Customer by email or create one from User data.
                if (!customer) {
                    const userAsCustomer = await userRepo.findOne({ where: { id: cid } });
                    if (userAsCustomer) {
                        // Try find a customer with same email
                        customer = await customerRepo.findOne({ where: { email: userAsCustomer.email } });
                        if (!customer) {
                            // Create a new Customer from User info
                            const newCustomer = customerRepo.create({
                                firstName: userAsCustomer.firstName || '',
                                lastName: userAsCustomer.lastName || '',
                                email: userAsCustomer.email || '',
                                phone: (userAsCustomer as any).phone || '',
                                address: '',
                            });
                            await customerRepo.save(newCustomer);
                            customer = newCustomer;
                        }
                    }
                }

                if (!customer) return response.status(400).json({ error: "Customer not found" });
            }

            if (petId) {
                pet = await petRepo.findOne({ where: { id: parseInt(petId) } });
                if (!pet) return response.status(400).json({ error: "Pet not found" });
            }

            if (veterinarianId) {
                veterinarian = await userRepo.findOne({ where: { id: parseInt(veterinarianId) } });
                if (!veterinarian) return response.status(400).json({ error: "Veterinarian not found" });
                // Ensure the selected user is actually a veterinarian
                if ((veterinarian as any).role !== 'VETERINARIAN') {
                    return response.status(400).json({ error: "Selected user is not a veterinarian" });
                }
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

            const results = await this.appointmentRepository.save(appointment);
            const saved = await this.appointmentRepository.findOne({ where: { id: results.id }, relations: ["customer", "pet", "veterinarian"] });
            return response.json(saved);
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