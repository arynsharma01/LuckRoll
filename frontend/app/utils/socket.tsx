import { io, Socket } from "socket.io-client";

let socket: Socket | null = null

export const getSocket = (): Socket | null => {
    if (typeof window === "undefined") return null        
        if (!socket) {
            const token = localStorage.getItem('Authorization')
            if (!token) return null

            socket =
                io("https://luckroll-production.up.railway.app", {
                    auth: {
                        token: token
                    },
                    autoConnect : true
                })
            
        }
        return socket

}

