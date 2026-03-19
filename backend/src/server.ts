import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import agentRoutes from "./routes/agentRoutes.js";
import donwloadRoutes from "./routes/downloadRoutes.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { initSocket } from "./socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/v1", agentRoutes);
app.use("/api/v1", donwloadRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Agentic Backend is Running", timestamp: new Date() });
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
export const io = new SocketIOServer(httpServer, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

// Optional: move socket logic to a separate file
initSocket(io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Cloud-Ops Server running on http://localhost:${PORT}`);
  console.log(`🧠 Gemini Agentic Graph is loaded and ready.`);
});