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
exports.AuthController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
class AuthController {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    register(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Registration request body:", request.body);
                const { firstName, lastName, email, password, role = "CUSTOMER" } = request.body;
                if (!firstName || !lastName || !email || !password) {
                    console.log("Missing required fields:", { firstName, lastName, email, password: !!password });
                    return response.status(400).json({
                        error: "All fields are required: firstName, lastName, email, password"
                    });
                }
                const existingUser = yield this.userRepository.findOne({
                    where: { email }
                });
                if (existingUser) {
                    console.log("User already exists with email:", email);
                    return response.status(400).json({
                        error: "User with this email already exists"
                    });
                }
                const user = new User_1.User();
                user.firstName = firstName;
                user.lastName = lastName;
                user.email = email;
                user.password = password;
                user.role = role;
                console.log("Attempting to save user:", {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                });
                const savedUser = yield this.userRepository.save(user);
                console.log("User saved successfully:", savedUser.id);
                const token = jwt.sign({ userId: savedUser.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
                console.log("JWT token generated for user:", savedUser.id);
                const { password: _ } = savedUser, userWithoutPassword = __rest(savedUser, ["password"]);
                return response.status(201).json({
                    user: userWithoutPassword,
                    token
                });
            }
            catch (error) {
                console.error("Registration error:", error);
                const errorMessage = error instanceof Error ? error.message : "Error during registration";
                console.error("Detailed error:", errorMessage);
                return response.status(500).json({
                    error: errorMessage
                });
            }
        });
    }
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = request.body;
                const user = yield this.userRepository.findOne({
                    where: { email },
                    select: ["id", "firstName", "lastName", "email", "password", "role"]
                });
                if (!user) {
                    return response.status(401).json({
                        error: "Invalid email or password"
                    });
                }
                const isValidPassword = yield bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    return response.status(401).json({
                        error: "Invalid email or password"
                    });
                }
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                return response.json({
                    user: userWithoutPassword,
                    token
                });
            }
            catch (error) {
                console.error("Login error:", error);
                return response.status(500).json({
                    error: error instanceof Error ? error.message : "Error during login"
                });
            }
        });
    }
    me(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = request.headers.authorization;
                if (!authHeader) {
                    return response.status(401).json({ error: 'Authorization header missing' });
                }
                const token = authHeader.split(' ')[1];
                if (!token) {
                    return response.status(401).json({ error: 'Token missing' });
                }
                let payload;
                try {
                    payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                }
                catch (err) {
                    return response.status(401).json({ error: 'Invalid token' });
                }
                const userId = payload.userId;
                if (!userId) {
                    return response.status(401).json({ error: 'Invalid token payload' });
                }
                const user = yield this.userRepository.findOne({
                    where: { id: userId },
                    select: ['id', 'firstName', 'lastName', 'email', 'role']
                });
                if (!user) {
                    return response.status(404).json({ error: 'User not found' });
                }
                return response.json(user);
            }
            catch (error) {
                console.error('Me endpoint error:', error);
                return response.status(500).json({ error: 'Error fetching current user' });
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map