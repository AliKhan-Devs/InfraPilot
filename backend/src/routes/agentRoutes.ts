import { Router } from "express";
import { handleArchitectRequest } from "../controllers/agentController.js";

const router = Router();

// Route: POST /api/v1/architect
router.post("/architect", handleArchitectRequest);

export default router;