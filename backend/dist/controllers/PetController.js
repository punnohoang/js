"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetController = void 0;
const data_source_1 = require("../data-source");
const Pet_1 = require("../entities/Pet");
class PetController {
    constructor() {
        this.petRepository = data_source_1.AppDataSource.getRepository(Pet_1.Pet);
    }
    async all(_request, response) {
        try {
            const pets = await this.petRepository.find({
                relations: ["owner", "appointments", "medicalRecords"]
            });
            return response.json(pets);
        }
        catch (error) {
            return response.status(500).json({ error: "Error fetching pets" });
        }
    }
    async one(request, response) {
        try {
            const id = parseInt(request.params.id);
            const pet = await this.petRepository.findOne({
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
    }
    async create(request, response) {
        try {
            const pet = this.petRepository.create(request.body);
            const results = await this.petRepository.save(pet);
            return response.json(results);
        }
        catch (error) {
            return response.status(500).json({ error: "Error creating pet" });
        }
    }
    async update(request, response) {
        try {
            const id = parseInt(request.params.id);
            const pet = await this.petRepository.findOneBy({ id });
            if (!pet) {
                return response.status(404).json({ error: "Pet not found" });
            }
            this.petRepository.merge(pet, request.body);
            const results = await this.petRepository.save(pet);
            return response.json(results);
        }
        catch (error) {
            return response.status(500).json({ error: "Error updating pet" });
        }
    }
    async remove(request, response) {
        try {
            const id = parseInt(request.params.id);
            const pet = await this.petRepository.findOneBy({ id });
            if (!pet) {
                return response.status(404).json({ error: "Pet not found" });
            }
            await this.petRepository.remove(pet);
            return response.json({ message: "Pet deleted successfully" });
        }
        catch (error) {
            return response.status(500).json({ error: "Error deleting pet" });
        }
    }
}
exports.PetController = PetController;
//# sourceMappingURL=PetController.js.map