import { Router } from "express";
import Historial from "../models/Historial.js";

const router = Router();

/**
 * Devuelve únicamente historial del tipo: "Texto Publicitario"
 */
router.get("/", async (req, res) => {
    try {
        const historial = await Historial.find({
            tipo_producto: "Texto Publicitario"
        }).sort({ fecha: -1 });

        res.json(historial);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo historial" });
    }
});

export default router;
