import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Pet } from "../entities/Pet";
import { Customer } from "../entities/Customer";

export class PetController {
    private petRepository = AppDataSource.getRepository(Pet);
    private customerRepository = AppDataSource.getRepository(Customer);

    async all(_request: Request, response: Response) {
        try {
            const pets = await this.petRepository.find({
                relations: ["owner", "appointments", "medicalRecords"]
            });
            return response.json(pets);
        } catch (error) {
            return response.status(500).json({ error: "Error fetching pets" });
        }
    }

    async one(request: Request, response: Response) {
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
        } catch (error) {
            return response.status(500).json({ error: "Error fetching pet" });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const { ownerId, ...petData } = request.body;

            const owner = await this.customerRepository.findOneBy({ id: ownerId });
            if (!owner) {
                return response.status(404).json({ error: "Owner not found" });
            }

            const pet = this.petRepository.create({
                ...petData,
                owner
            });

            const results = await this.petRepository.save(pet);
            return response.json(results);
        } catch (error) {
            console.error("Error creating pet:", error);
            return response.status(500).json({ error: "Error creating pet" });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const pet = await this.petRepository.findOneBy({ id });

            if (!pet) {
                return response.status(404).json({ error: "Pet not found" });
            }

            this.petRepository.merge(pet, request.body);
            const results = await this.petRepository.save(pet);
            return response.json(results);
        } catch (error) {
            return response.status(500).json({ error: "Error updating pet" });
        }
    }

    async remove(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const pet = await this.petRepository.findOneBy({ id });

            if (!pet) {
                return response.status(404).json({ error: "Pet not found" });
            }

            await this.petRepository.remove(pet);
            return response.json({ message: "Pet deleted successfully" });
        } catch (error) {
            return response.status(500).json({ error: "Error deleting pet" });
        }
    }
}