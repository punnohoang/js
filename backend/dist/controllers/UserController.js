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
exports.UserController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcryptjs"));
class UserController {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    all(_request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepository.find({
                    select: ["id", "firstName", "lastName", "email", "role", "specialization"]
                });
                return response.json(users);
            }
            catch (error) {
                return response.status(500).json({ error: "Error fetching users" });
            }
        });
    }
    one(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const user = yield this.userRepository.findOne({
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
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = request.body;
                const user = Object.assign(new User_1.User(), userData);
                yield user.hashPassword();
                const savedUser = yield this.userRepository.save(user);
                const { password: _ } = savedUser, userWithoutPassword = __rest(savedUser, ["password"]);
                return response.json(userWithoutPassword);
            }
            catch (error) {
                return response.status(500).json({ error: "Error creating user" });
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const user = yield this.userRepository.findOneBy({ id });
                if (!user) {
                    return response.status(404).json({ error: "User not found" });
                }
                if (request.body.password) {
                    request.body.password = yield bcrypt.hash(request.body.password, 10);
                }
                this.userRepository.merge(user, request.body);
                const results = yield this.userRepository.save(user);
                const { password } = results, userWithoutPassword = __rest(results, ["password"]);
                return response.json(userWithoutPassword);
            }
            catch (error) {
                return response.status(500).json({ error: "Error updating user" });
            }
        });
    }
    remove(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(request.params.id);
                const user = yield this.userRepository.findOneBy({ id });
                if (!user) {
                    return response.status(404).json({ error: "User not found" });
                }
                yield this.userRepository.remove(user);
                return response.json({ message: "User deleted successfully" });
            }
            catch (error) {
                return response.status(500).json({ error: "Error deleting user" });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map