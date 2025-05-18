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
const resend_1 = require("resend");
const signupRouter = express_1.default.Router();
(0, dotenv_1.config)();
signupRouter.use(express_1.default.json());
const prisma = new client_1.PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_ACC
}).$extends((0, extension_accelerate_1.withAccelerate)());
const resend = new resend_1.Resend(process.env.RESEND_API);
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(4, "name too small "),
    password: zod_1.z.string().min(8, "password should be atleast 8 characters "),
    username: zod_1.z.string().min(4, "username should be atleast 4 characters ")
});
const otpSend = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let otp = Math.floor(1000 + Math.random() * 4000);
    const { data, error } = yield resend.emails.send({
        from: "Luck Roll <luckroll@100xaryan.site>",
        to: email,
        subject: "One-Time Password (OTP) for registering at Luck Roll",
        html: `
  <h1 style="font-family: sans-serif; color: #333;">Your OTP for registering at <strong>Luck Roll</strong> is <span style="color: #007bff;">${otp}</span>.</h1>
  <p style="font-family: sans-serif; color: #555;">This OTP will expire in <strong>15 minutes</strong>.</p>
`
    });
    if (error) {
        console.log(error);
        return otp;
    }
    else {
        console.log(data);
    }
    return otp;
});
signupRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, password, username } = req.body;
        console.log(req.body);
        if (!name || !email || !password || !username) {
            return res.status(400).json({
                message: "missing details "
            });
        }
        const validUserSchema = userSchema.safeParse({
            email: email,
            name: name,
            password: password,
            username: username
        });
        if (!validUserSchema.success) {
            return res.status(402).json({
                message: (_a = validUserSchema.error) === null || _a === void 0 ? void 0 : _a.errors[0].message
            });
        }
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "email /username already exists  "
            });
        }
        let otp = yield otpSend(email);
        const secretKey = process.env.JWT_PASSWORD;
        const middleToken = jsonwebtoken_1.default.sign({ email, password, name, username }, secretKey);
        const now = Date.now();
        const expiresAt = new Date(now + 15 * 60 * 1000);
        const userOtp = yield prisma.userOtp.create({
            data: {
                id: middleToken,
                otp: otp,
                deleteAt: expiresAt
            }
        });
        return res.status(200).json({
            message: "ok",
            middleToken: userOtp.id,
        });
        // const createUser = await prisma.user.create({
        //     data: {
        //         username: username,
        //         email: email,
        //         name: name,
        //         password: password
        //     }
        // })
        // const secretKey = process.env.JWT_PASSWORD as string
        // const token = jwt.sign({ email }, secretKey, {
        //     expiresIn: "7d"
        // })
        // return res.status(200).json({
        //     message: "signup successfull",
        //     token: "Bearer " + token,
        //     user: createUser.id
        // })
    }
    catch (e) {
        return res.status(400).json({
            message: "some internal error " + e
        });
    }
}));
signupRouter.get('/username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.query.username || "admin";
    console.log(user);
    const availableUsername = yield prisma.user.findFirst({
        where: {
            username: user
        }
    });
    if (!availableUsername) {
        console.log("available");
        return res.status(200).json({
            message: "username is available "
        });
    }
    console.log("not available ");
    return res.status(400).json({
        message: "Username not available"
    });
}));
signupRouter.post('/verify/otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, otp } = req.body;
        const date = new Date();
        const validOtp = yield prisma.userOtp.findFirst({
            where: {
                AND: [
                    { id: id },
                    { otp: otp },
                    { deleteAt: {
                            gt: date
                        } }
                ]
            }
        });
        if (!validOtp) {
            return res.status(401).json({
                message: "Invalid/expiered OTP  please try again later "
            });
        }
        const payload = jsonwebtoken_1.default.decode(id);
        console.log(payload);
        const { username, email, name, password } = payload;
        const createUser = yield prisma.user.create({
            data: {
                username: username,
                email: email,
                name: name,
                password: password
            }
        });
        const secretKey = process.env.JWT_PASSWORD;
        const token = jsonwebtoken_1.default.sign({ email }, secretKey, {
            expiresIn: "7d"
        });
        return res.status(200).json({
            message: "signup successfull",
            token: "Bearer " + token,
            user: createUser.id
        });
    }
    catch (e) {
        res.status(400).json({
            message: "Some internal error "
        });
    }
}));
exports.default = signupRouter;
