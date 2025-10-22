"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const data_source_1 = require("../data-source");
const Invoice_1 = require("../entities/Invoice");
const InvoiceItem_1 = require("../entities/InvoiceItem");
class InvoiceController {
    constructor() {
        this.invoiceRepository = data_source_1.AppDataSource.getRepository(Invoice_1.Invoice);
        this.invoiceItemRepository = data_source_1.AppDataSource.getRepository(InvoiceItem_1.InvoiceItem);
    }
    async all(_request, response) {
        try {
            const invoices = await this.invoiceRepository.find({
                relations: ["customer", "items"]
            });
            return response.json(invoices);
        }
        catch (error) {
            return response.status(500).json({ error: "Error fetching invoices" });
        }
    }
    async one(request, response) {
        try {
            const id = parseInt(request.params.id);
            const invoice = await this.invoiceRepository.findOne({
                where: { id },
                relations: ["customer", "items"]
            });
            if (!invoice) {
                return response.status(404).json({ error: "Invoice not found" });
            }
            return response.json(invoice);
        }
        catch (error) {
            return response.status(500).json({ error: "Error fetching invoice" });
        }
    }
    async create(request, response) {
        try {
            const { items, ...invoiceData } = request.body;
            const invoice = this.invoiceRepository.create(invoiceData);
            const savedInvoice = await this.invoiceRepository.save(invoice);
            if (items && items.length > 0) {
                const invoiceItems = items.map((item) => {
                    const invoiceItem = this.invoiceItemRepository.create({
                        ...item,
                        invoice: savedInvoice
                    });
                    return invoiceItem;
                });
                await this.invoiceItemRepository.save(invoiceItems);
            }
            return response.json(savedInvoice);
        }
        catch (error) {
            return response.status(500).json({ error: "Error creating invoice" });
        }
    }
    async update(request, response) {
        try {
            const id = parseInt(request.params.id);
            const invoice = await this.invoiceRepository.findOneBy({ id });
            if (!invoice) {
                return response.status(404).json({ error: "Invoice not found" });
            }
            const { items, ...invoiceData } = request.body;
            this.invoiceRepository.merge(invoice, invoiceData);
            const savedInvoice = await this.invoiceRepository.save(invoice);
            if (items && items.length > 0) {
                await this.invoiceItemRepository.delete({ invoice: { id } });
                const invoiceItems = items.map((item) => {
                    const invoiceItem = this.invoiceItemRepository.create({
                        ...item,
                        invoice: savedInvoice
                    });
                    return invoiceItem;
                });
                await this.invoiceItemRepository.save(invoiceItems);
            }
            return response.json(savedInvoice);
        }
        catch (error) {
            return response.status(500).json({ error: "Error updating invoice" });
        }
    }
    async remove(request, response) {
        try {
            const id = parseInt(request.params.id);
            const invoice = await this.invoiceRepository.findOneBy({ id });
            if (!invoice) {
                return response.status(404).json({ error: "Invoice not found" });
            }
            await this.invoiceItemRepository.delete({ invoice: { id } });
            await this.invoiceRepository.remove(invoice);
            return response.json({ message: "Invoice deleted successfully" });
        }
        catch (error) {
            return response.status(500).json({ error: "Error deleting invoice" });
        }
    }
}
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=InvoiceController.js.map