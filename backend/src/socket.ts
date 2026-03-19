import { Server as SocketIOServer, Socket } from "socket.io";

export function initSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    socket.on("message", (msg) => {
      console.log(`Message from ${socket.id}:`, msg);
      socket.emit("reply", `Server received: ${msg}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
}