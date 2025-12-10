import { Router } from "express";
import Producto from "../models/Producto.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const productos = await Producto.find({});
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

export default router;
