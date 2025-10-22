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
exports.PetController = void 0;
const data_source_1 = require("../data-source");
const Pet_1 = require("../entities/Pet");
const Customer_1 = require("../entities/Customer");
class PetController {
    constructor() {
        this.petRepository = data_source_1.AppDataSource.getRepository(Pet_1.Pet);
        this.customerRepository = data_source_1.AppDataSource.getRepository(Customer_1.Customer);
    }
    all(_request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pets = yield this.petRepository.find({
                    relations: ["owner", "appointments", "medicalRecords"]
                });
                return response.json(pets);
            }
            catch (error) {
                return response.status(500).json({ error: "Error fetching pets" });
            }
        });
    }
    one(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const pet = yield this.petRepository.findOne({
                    where: { id },
                    relations: ["owner", "appointments", "medicalRecords"]
                });
                if (!pet) {
                    return response.status(404).json({ error: "Pet not found" });
                }
                return response.json(pet);
            }
            catch (error) {
                return response.status(500).json({ error: "Error fetching pet" });
            }
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = request.body, { ownerId } = _a, petData = __rest(_a, ["ownerId"]);
                const owner = yield this.customerRepository.findOneBy({ id: ownerId });
                if (!owner) {
                    return response.status(404).json({ error: "Owner not found" });
                }
                const pet = this.petRepository.create(Object.assign(Object.assign({}, petData), { owner }));
                const results = yield this.petRepository.save(pet);
                return response.json(results);
            }
            catch (error) {
                console.error("Error creating pet:", error);
                return response.status(500).json({ error: "Error creating pet" });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const pet = yield this.petRepository.findOneBy({ id });
                if (!pet) {
                    return response.status(404).json({ error: "Pet not found" });
                }
                this.petRepository.merge(pet, request.body);
                const results = yield this.petRepository.save(pet);
                return response.json(results);
            }
            catch (error) {
                return response.status(500).json({ error: "Error updating pet" });
            }
        });
    }
    remove(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const pet = yield this.petRepository.findOneBy({ id });
                if (!pet) {
                    return response.status(404).json({ error: "Pet not found" });
                }
                yield this.petRepository.remove(pet);
                return response.json({ message: "Pet deleted successfully" });
            }
            catch (error) {
                return response.status(500).json({ error: "Error deleting pet" });
            }
        });
    }
}
exports.PetController = PetController;
//# sourceMappingURL=PetController.js.map