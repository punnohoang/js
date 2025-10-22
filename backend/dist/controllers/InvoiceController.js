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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
    all(_request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoices = yield this.invoiceRepository.find({
                    relations: ["customer", "items"]
                });
                return response.json(invoices);
            }
            catch (error) {
                return response.status(500).json({ error: "Error fetching invoices" });
            }
        });
    }
    one(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const invoice = yield this.invoiceRepository.findOne({
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
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = request.body, { items } = _a, invoiceData = __rest(_a, ["items"]);
                const invoice = this.invoiceRepository.create(invoiceData);
                const savedInvoice = yield this.invoiceRepository.save(invoice);
                if (items && items.length > 0) {
                    const invoiceItems = items.map((item) => {
                        const invoiceItem = this.invoiceItemRepository.create(Object.assign(Object.assign({}, item), { invoice: savedInvoice }));
                        return invoiceItem;
                    });
                    yield this.invoiceItemRepository.save(invoiceItems);
                }
                return response.json(savedInvoice);
            }
            catch (error) {
                return response.status(500).json({ error: "Error creating invoice" });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const invoice = yield this.invoiceRepository.findOneBy({ id });
                if (!invoice) {
                    return response.status(404).json({ error: "Invoice not found" });
                }
                const _a = request.body, { items } = _a, invoiceData = __rest(_a, ["items"]);
                this.invoiceRepository.merge(invoice, invoiceData);
                const savedInvoice = yield this.invoiceRepository.save(invoice);
                if (items && items.length > 0) {
                    yield this.invoiceItemRepository.delete({ invoice: { id } });
                    const invoiceItems = items.map((item) => {
                        const invoiceItem = this.invoiceItemRepository.create(Object.assign(Object.assign({}, item), { invoice: savedInvoice }));
                        return invoiceItem;
                    });
                    yield this.invoiceItemRepository.save(invoiceItems);
                }
                return response.json(savedInvoice);
            }
            catch (error) {
                return response.status(500).json({ error: "Error updating invoice" });
            }
        });
    }
    remove(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const invoice = yield this.invoiceRepository.findOneBy({ id });
                if (!invoice) {
                    return response.status(404).json({ error: "Invoice not found" });
                }
                yield this.invoiceItemRepository.delete({ invoice: { id } });
                yield this.invoiceRepository.remove(invoice);
                return response.json({ message: "Invoice deleted successfully" });
            }
            catch (error) {
                return response.status(500).json({ error: "Error deleting invoice" });
            }
        });
    }
}
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=InvoiceController.js.map