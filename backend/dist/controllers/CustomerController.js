"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const data_source_1 = require("../data-source");
const Customer_1 = require("../entities/Customer");
class CustomerController {
    constructor() {
        this.customerRepository = data_source_1.AppDataSource.getRepository(Customer_1.Customer);
    }
    async all(_request, response) {
        try {
            const customers = await this.customerRepository.find({
                relations: ["pets", "appointments", "invoices"]
            });
            return response.json(customers);
        }
        catch (error) {
            return response.status(500).json({ error: "Error fetching customers" });
        }
    }
    async one(request, response) {
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
        }
        catch (error) {
            return response.status(500).json({ error: "Error fetching customer" });
        }
    }
    async create(request, response) {
        try {
            const customer = this.customerRepository.create(request.body);
            const results = await this.customerRepository.save(customer);
            return response.json(results);
        }
        catch (error) {
            return response.status(500).json({ error: "Error creating customer" });
        }
    }
    async update(request, response) {
        try {
            const id = parseInt(request.params.id);
            const customer = await this.customerRepository.findOneBy({ id });
            if (!customer) {
                return response.status(404).json({ error: "Customer not found" });
            }
            this.customerRepository.merge(customer, request.body);
            const results = await this.customerRepository.save(customer);
            return response.json(results);
        }
        catch (error) {
            return response.status(500).json({ error: "Error updating customer" });
        }
    }
    async remove(request, response) {
        try {
            const id = parseInt(request.params.id);
            const customer = await this.customerRepository.findOneBy({ id });
            if (!customer) {
                return response.status(404).json({ error: "Customer not found" });
            }
            await this.customerRepository.remove(customer);
            return response.json({ message: "Customer deleted successfully" });
        }
        catch (error) {
            return response.status(500).json({ error: "Error deleting customer" });
        }
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=CustomerController.js.map