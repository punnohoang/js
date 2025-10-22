import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Customer } from "../entities/Customer";
import { Repository } from "typeorm";

export class CustomerController {
    private customerRepository: Repository<Customer>;

    constructor() {
        this.customerRepository = AppDataSource.getRepository(Customer);
    }

    async all(_request: Request, response: Response) {
        try {
            const customers = await this.customerRepository.find({
                relations: ["pets", "appointments", "invoices"]
            });
            return response.json(customers);
        } catch (error) {
            return response.status(500).json({ error: "Error fetching customers" });
        }
    }

    async one(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const customer = await this.customerRepository.findOne({
                where: { id },
                relations: ["pets", "appointments", "invoices"]
            });

            if (!customer) {
                return response.status(404).json({ error: "Customer not found" });
            }

            return response.json(customer);
        } catch (error) {
            return response.status(500).json({ error: "Error fetching customer" });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const customer = this.customerRepository.create(request.body);
            const results = await this.customerRepository.save(customer);
            return response.json(results);
        } catch (error) {
            return response.status(500).json({ error: "Error creating customer" });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const customer = await this.customerRepository.findOneBy({ id });

            if (!customer) {
                return response.status(404).json({ error: "Customer not found" });
            }

            this.customerRepository.merge(customer, request.body);
            const results = await this.customerRepository.save(customer);
            return response.json(results);
        } catch (error) {
            return response.status(500).json({ error: "Error updating customer" });
        }
    }

    async remove(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const customer = await this.customerRepository.findOneBy({ id });

            if (!customer) {
                return response.status(404).json({ error: "Customer not found" });
            }

            await this.customerRepository.remove(customer);
            return response.json({ message: "Customer deleted successfully" });
        } catch (error) {
            return response.status(500).json({ error: "Error deleting customer" });
        }
    }
}