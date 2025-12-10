import { Router } from "express";
import { openai } from "../services/chatgpt.service.js";
import Historial from "../models/Historial.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const filtros = req.body;

        const prompt = `
Genera un texto publicitario basado en:
Producto: ${filtros.producto}
Edad: ${filtros.edad}
Genero: ${filtros.genero}
Intereses: ${filtros.intereses}
Objetivo: ${filtros.objetivo}
Tono: ${filtros.tono}
Canal: ${filtros.canal}
Diferenciador: ${filtros.diferenciador}
Creatividad: ${filtros.creatividad}

Descripción del producto:
${filtros.descripcion}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const textoGenerado = completion.choices[0].message.content;

        await Historial.create({
            busqueda: JSON.stringify(filtros, null, 2),
            resultado: textoGenerado,
            tipo_producto: "Texto Publicitario",
            fecha: new Date()
        });

        res.json({
            ok: true,
            resultado: textoGenerado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            error: "Error generando texto"
        });
    }
});

export default router;
