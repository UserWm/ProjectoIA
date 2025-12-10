import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadJSON } from "../controllers/upload.controller.js";

const router = Router();

router.post("/upload-json", upload.single("file"), uploadJSON);

export default router;
