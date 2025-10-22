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
exports.CustomerController = void 0;
const data_source_1 = require("../data-source");
const Customer_1 = require("../entities/Customer");
class CustomerController {
    constructor() {
        this.customerRepository = data_source_1.AppDataSource.getRepository(Customer_1.Customer);
    }
    all(_request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customers = yield this.customerRepository.find({
                    relations: ["pets", "appointments", "invoices"]
                });
                return response.json(customers);
            }
            catch (error) {
                return response.status(500).json({ error: "Error fetching customers" });
            }
        });
    }
    one(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const customer = yield this.customerRepository.findOne({
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
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = this.customerRepository.create(request.body);
                const results = yield this.customerRepository.save(customer);
                return response.json(results);
            }
            catch (error) {
                return response.status(500).json({ error: "Error creating customer" });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const customer = yield this.customerRepository.findOneBy({ id });
                if (!customer) {
                    return response.status(404).json({ error: "Customer not found" });
                }
                this.customerRepository.merge(customer, request.body);
                const results = yield this.customerRepository.save(customer);
                return response.json(results);
            }
            catch (error) {
                return response.status(500).json({ error: "Error updating customer" });
            }
        });
    }
    remove(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const customer = yield this.customerRepository.findOneBy({ id });
                if (!customer) {
                    return response.status(404).json({ error: "Customer not found" });
                }
                yield this.customerRepository.remove(customer);
                return response.json({ message: "Customer deleted successfully" });
            }
            catch (error) {
                return response.status(500).json({ error: "Error deleting customer" });
            }
        });
    }
}
exports.CustomerController = CustomerController;
//# sourceMappingURL=CustomerController.js.map