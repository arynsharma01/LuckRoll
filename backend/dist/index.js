"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const extension_accelerate_1 = require("@prisma/extension-accelerate");
const dotenv_1 = require("dotenv");
const cash_1 = __importDefault(require("./socket/cash"));
const routes_1 = __importDefault(require("./routes"));
const bet_1 = __importDefault(require("./socket/bet"));
const basePrisma = new client_1.PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_ACC
});
const prisma = basePrisma.$extends((0, extension_accelerate_1.withAccelerate)());
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use('/luckroll/v1/user', routes_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
let useremail;
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        console.log("mo token ");
        return next(new Error("no token was found "));
    }
    try {
        const jwtPassword = process.env.JWT_PASSWORD || "";
        let value = token.split(" ");
        if (value[0] != "Bearer") {
            throw new Error("invalid token format ");
        }
        const auth = value[1];
        const decoded = jsonwebtoken_1.default.verify(auth, jwtPassword);
        useremail = decoded.email;
        if (!decoded) {
            return next(new Error("invalid token  "));
        }
        const existingUser = prisma.user.findFirst({
            where: {
                email: decoded.email
            }
        });
        if (!existingUser) {
            return next(new Error("user does not exist "));
        }
        console.log("in the middleware");
        next();
    }
    catch (e) {
        next(new Error("some unknown error "));
    }
});
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("getCash", () => {
        (0, cash_1.default)(socket, useremail, prisma);
    });
    socket.on("bet", (data) => {
        const multiplier = data.multiplier;
        const selected = data.selected;
        const betValue = data.betValue;
        console.log("inside bet ");
        (0, bet_1.default)(socket, useremail, prisma, multiplier, selected, betValue);
    });
    socket.on("message", (data) => {
        console.log(data);
        socket.emit("coins", { "coins": 20 });
    });
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
server.listen(3001, () => {
    console.log("🚀 Socket.IO server running on port 3001");
});
