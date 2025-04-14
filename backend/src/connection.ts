import { io, Socket } from "socket.io-client";

// Define the expected socket type
const socket: Socket = io("http://localhost:3001");

socket.on("connect", () => {
    
  console.log("✅ Connected to server:", socket.id);
  socket.emit("chatMessage", { user: "Player1", message: "Hello, Server!" }); 
});

socket.emit("message" ,{"message" :
  "hi t"
}) 
socket.emit("play" , {
  "bet": 30 ,
  "risk" :"low",
  "selected" :"low"
})

socket.emit("play" , {
  "bet": 30 ,
  "risk" :"medium",
  "selected" :"high"
})

socket.emit("play" , {
  "bet": 30 ,
  "risk" :"high",
  "selected" :"high"
})

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
