import { Router } from "express";
import { downloadTerraformProject } from "../controllers/downloadController.js";


const router = Router();

router.post('/download-infra', downloadTerraformProject);

export default router;