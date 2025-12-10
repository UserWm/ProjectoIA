import { Router } from "express";
import Historial from "../models/Historial.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const historial = await Historial.find({
            tipo_producto: "Afiches para redes sociales"
        }).sort({ fecha: -1 });

        res.json(historial);

    } catch (error) {
        res.status(500).json({ error: "No se pudo obtener el historial" });
    }
});

export default router;
