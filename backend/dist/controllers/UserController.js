"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcryptjs"));
class UserController {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async all(_request, response) {
        try {
            const users = await this.userRepository.find({
                select: ["id", "firstName", "lastName", "email", "role", "specialization"]
            });
            return response.json(users);
        }
        catch (error) {
            return response.status(500).json({ error: "Error fetching users" });
        }
    }
    async one(request, response) {
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
        }
        catch (error) {
            return response.status(500).json({ error: "Error fetching user" });
        }
    }
    async create(request, response) {
        try {
            const userData = request.body;
            const user = Object.assign(new User_1.User(), userData);
            await user.hashPassword();
            const savedUser = await this.userRepository.save(user);
            const { password: _, ...userWithoutPassword } = savedUser;
            return response.json(userWithoutPassword);
        }
        catch (error) {
            return response.status(500).json({ error: "Error creating user" });
        }
    }
    async update(request, response) {
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
        }
        catch (error) {
            return response.status(500).json({ error: "Error updating user" });
        }
    }
    async remove(request, response) {
        try {
            const id = parseInt(request.params.id);
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                return response.status(404).json({ error: "User not found" });
            }
            await this.userRepository.remove(user);
            return response.json({ message: "User deleted successfully" });
        }
        catch (error) {
            return response.status(500).json({ error: "Error deleting user" });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map