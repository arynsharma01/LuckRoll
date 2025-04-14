"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
// Define the expected socket type
const socket = (0, socket_io_client_1.io)("http://localhost:3001");
socket.on("connect", () => {
    console.log("✅ Connected to server:", socket.id);
    socket.emit("chatMessage", { user: "Player1", message: "Hello, Server!" });
});
socket.emit("message", { "message": "hi t"
});
socket.emit("play", {
    "bet": 30,
    "risk": "low",
    "selected": "low"
});
socket.emit("play", {
    "bet": 30,
    "risk": "medium",
    "selected": "high"
});
socket.emit("play", {
    "bet": 30,
    "risk": "high",
    "selected": "high"
});
socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});
