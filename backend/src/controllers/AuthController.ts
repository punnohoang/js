import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export class AuthController {
    private userRepository = AppDataSource.getRepository(User);

    async register(request: Request, response: Response) {
        try {
            console.log("Registration request body:", request.body);
            const { firstName, lastName, email, password, role = "CUSTOMER" } = request.body;

            if (!firstName || !lastName || !email || !password) {
                console.log("Missing required fields:", { firstName, lastName, email, password: !!password });
                return response.status(400).json({
                    error: "All fields are required: firstName, lastName, email, password"
                });
            }

            // Check if user already exists
            const existingUser = await this.userRepository.findOne({
                where: { email }
            });

            if (existingUser) {
                console.log("User already exists with email:", email);
                return response.status(400).json({
                    error: "User with this email already exists"
                });
            }

            // Create new user
            const user = new User();
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            // do not pre-hash here — the User entity has a @BeforeInsert hook that hashes the password
            user.password = password;
            user.role = role;

            // Save user
            console.log("Attempting to save user:", {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            });

            const savedUser = await this.userRepository.save(user);
            console.log("User saved successfully:", savedUser.id);

            // Generate JWT token
            const token = jwt.sign(
                { userId: savedUser.id },
                process.env.JWT_SECRET || "your-secret-key",
                { expiresIn: "24h" }
            );
            console.log("JWT token generated for user:", savedUser.id);

            // Return user data (excluding password) and token
            const { password: _, ...userWithoutPassword } = savedUser;
            return response.status(201).json({
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error instanceof Error ? error.message : "Error during registration";
            console.error("Detailed error:", errorMessage);
            return response.status(500).json({
                error: errorMessage
            });
        }
    }

    async login(request: Request, response: Response) {
        try {
            const { email, password } = request.body;

            // Find user by email
            const user = await this.userRepository.findOne({
                where: { email },
                select: ["id", "firstName", "lastName", "email", "password", "role"] // Include password for verification
            });

            if (!user) {
                return response.status(401).json({
                    error: "Invalid email or password"
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return response.status(401).json({
                    error: "Invalid email or password"
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET || "your-secret-key",
                { expiresIn: "24h" }
            );

            // Return user data (excluding password) and token
            const { password: _, ...userWithoutPassword } = user;
            return response.json({
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            console.error("Login error:", error);
            return response.status(500).json({
                error: error instanceof Error ? error.message : "Error during login"
            });
        }
    }

    async me(request: Request, response: Response) {
        try {
            const authHeader = request.headers.authorization as string | undefined;
            if (!authHeader) {
                return response.status(401).json({ error: 'Authorization header missing' });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return response.status(401).json({ error: 'Token missing' });
            }

            let payload: any;
            try {
                payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            } catch (err) {
                return response.status(401).json({ error: 'Invalid token' });
            }

            const userId = payload.userId;
            if (!userId) {
                return response.status(401).json({ error: 'Invalid token payload' });
            }

            const user = await this.userRepository.findOne({
                where: { id: userId },
                select: ['id', 'firstName', 'lastName', 'email', 'role']
            });

            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

            return response.json(user);
        } catch (error) {
            console.error('Me endpoint error:', error);
            return response.status(500).json({ error: 'Error fetching current user' });
        }
    }
}