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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const signinRouter = express_1.default.Router();
(0, dotenv_1.config)();
signinRouter.use(express_1.default.json());
const prisma = new client_1.PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_ACC
}).$extends((0, extension_accelerate_1.withAccelerate)());
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
signinRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "missing details "
            });
        }
        const validUserSchema = userSchema.safeParse({
            email: email,
        });
        if (!validUserSchema.success) {
            return res.status(404).json({
                message: "invalid email "
            });
        }
        const existingUser = yield prisma.user.findFirst({
            where: {
                AND: {
                    email: email,
                    password: password
                }
            }
        });
        if (!existingUser) {
            return res.status(409).json({
                message: "email does not exists / wrong password  "
            });
        }
        const secretKey = process.env.JWT_PASSWORD;
        const token = jsonwebtoken_1.default.sign({ email }, secretKey, {
            expiresIn: "7d"
        });
        return res.status(200).json({
            message: "signin successfull",
            token: "Bearer " + token,
            user: existingUser.id
        });
    }
    catch (e) {
        return res.status(400).json({
            message: "some internal error " + e
        });
    }
}));
exports.default = signinRouter;
