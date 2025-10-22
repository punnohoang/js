import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Invoice } from "../entities/Invoice";
import { InvoiceItem } from "../entities/InvoiceItem";

export class InvoiceController {
    private invoiceRepository = AppDataSource.getRepository(Invoice);
    private invoiceItemRepository = AppDataSource.getRepository(InvoiceItem);

    async all(_request: Request, response: Response) {
        try {
            const invoices = await this.invoiceRepository.find({
                relations: ["customer", "items"]
            });
            return response.json(invoices);
        } catch (error) {
            return response.status(500).json({ error: "Error fetching invoices" });
        }
    }

    async one(request: Request, response: Response) {
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
        } catch (error) {
            return response.status(500).json({ error: "Error fetching invoice" });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const { items, ...invoiceData } = request.body;
            const invoice = this.invoiceRepository.create(invoiceData);
            const savedInvoice = await this.invoiceRepository.save(invoice);

            if (items && items.length > 0) {
                const invoiceItems = items.map((item: any) => {
                    const invoiceItem = this.invoiceItemRepository.create({
                        ...item,
                        invoice: savedInvoice
                    });
                    return invoiceItem;
                });

                await this.invoiceItemRepository.save(invoiceItems);
            }

            return response.json(savedInvoice);
        } catch (error) {
            return response.status(500).json({ error: "Error creating invoice" });
        }
    }

    async update(request: Request, response: Response) {
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
                // Remove existing items
                await this.invoiceItemRepository.delete({ invoice: { id } });

                // Add new items
                const invoiceItems = items.map((item: any) => {
                    const invoiceItem = this.invoiceItemRepository.create({
                        ...item,
                        invoice: savedInvoice
                    });
                    return invoiceItem;
                });

                await this.invoiceItemRepository.save(invoiceItems);
            }

            return response.json(savedInvoice);
        } catch (error) {
            return response.status(500).json({ error: "Error updating invoice" });
        }
    }

    async remove(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const invoice = await this.invoiceRepository.findOneBy({ id });

            if (!invoice) {
                return response.status(404).json({ error: "Invoice not found" });
            }

            // Delete related invoice items first
            await this.invoiceItemRepository.delete({ invoice: { id } });

            // Then delete the invoice
            await this.invoiceRepository.remove(invoice);
            return response.json({ message: "Invoice deleted successfully" });
        } catch (error) {
            return response.status(500).json({ error: "Error deleting invoice" });
        }
    }
}