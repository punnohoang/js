import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcryptjs";

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

    async all(_request: Request, response: Response) {
        try {
            const users = await this.userRepository.find({
                select: ["id", "firstName", "lastName", "email", "role", "specialization"]
            });
            return response.json(users);
        } catch (error) {
            return response.status(500).json({ error: "Error fetching users" });
        }
    }

    async one(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const user = await this.userRepository.findOne({
                where: { id },
                select: ["id", "firstName", "lastName", "email", "role", "specialization"]
            });

            if (!user) {
                return response.status(404).json({ error: "User not found" });
            }

            return response.json(user);
        } catch (error) {
            return response.status(500).json({ error: "Error fetching user" });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const userData = request.body;
            const user = Object.assign(new User(), userData);
            await user.hashPassword();
            const savedUser = await this.userRepository.save(user);

            const { password: _, ...userWithoutPassword } = savedUser;
            return response.json(userWithoutPassword);
        } catch (error) {
            return response.status(500).json({ error: "Error creating user" });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const user = await this.userRepository.findOneBy({ id });

            if (!user) {
                return response.status(404).json({ error: "User not found" });
            }

            if (request.body.password) {
                request.body.password = await bcrypt.hash(request.body.password, 10);
            }

            this.userRepository.merge(user, request.body);
            const results = await this.userRepository.save(user);
            const { password, ...userWithoutPassword } = results;
            return response.json(userWithoutPassword);
        } catch (error) {
            return response.status(500).json({ error: "Error updating user" });
        }
    }

    async remove(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id);
            const user = await this.userRepository.findOneBy({ id });

            if (!user) {
                return response.status(404).json({ error: "User not found" });
            }

            await this.userRepository.remove(user);
            return response.json({ message: "User deleted successfully" });
        } catch (error) {
            return response.status(500).json({ error: "Error deleting user" });
        }
    }
}