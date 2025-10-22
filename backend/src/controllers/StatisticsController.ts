import { Request, Response } from "express";
import { AppDataSource } from "../data-source";

export class StatisticsController {
    async getStats(_request: Request, response: Response) {
        try {
            const customerRepo = AppDataSource.getRepository("Customer");
            const invoiceRepo = AppDataSource.getRepository("Invoice");
            const appointmentRepo = AppDataSource.getRepository("Appointment");
            const userRepo = AppDataSource.getRepository("User");

            const totalCustomers = await customerRepo.count();
            const totalUsers = await userRepo.count();
            const totalAppointments = await appointmentRepo.count();

            // Sum invoice totalAmount where status is PAID or any status (fallback)
            const invoices = await invoiceRepo.find();
            const totalRevenue = invoices.reduce((s: number, inv: any) => s + (parseFloat(inv.totalAmount as any) || 0), 0);

            const totalVeterinarians = await userRepo.count({ where: { role: 'VETERINARIAN' } });

            // Return plain stats object (frontend expects the data directly)
            return response.json({
                totalUsers,
                totalCustomers,
                totalRevenue,
                totalAppointments,
                totalVeterinarians,
                appointmentsByStatus: {},
                revenueByService: {},
            });
        } catch (error) {
            console.error('Error fetching statistics', error);
            return response.status(500).json({ success: false, error: 'Error fetching statistics' });
        }
    }
}
