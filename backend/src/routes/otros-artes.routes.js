import { Router } from "express";
import { openai } from "../services/chatgpt.service.js";
import Historial from "../models/Historial.js";

const router = Router();

// ========================================
//  GENERAR TEXTO PARA OTROS ARTES
// ========================================
router.post("/", async (req, res) => {
    try {
        const filtros = req.body;

        const prompt = `
Genera el contenido textual para un arte profesional según los siguientes filtros:

Producto: ${filtros.producto}
Tipo de arte: ${filtros.tipo_arte}
Interacciones recientes del usuario: ${filtros.interacciones}
Basado en transacciones: ${filtros.transacciones}

Requerimientos adicionales:
${filtros.descripcion}

Genera:
- Título acerca del producto ${filtros.producto} (headline)
- Texto corto secundario
- 1 CTA claro
- Breve recomendación visual para el diseñador

Estilo: profesional, directo, orientado a marketing digital.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const contenido = completion.choices[0].message.content;

        await Historial.create({
            busqueda: JSON.stringify(filtros, null, 2),
            resultado: contenido,
            tipo_producto: "Otros Artes"
        });

        res.json({
            ok: true,
            resultado: contenido
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Error generando arte textual" });
    }
});

// ========================================
//  LISTAR HISTORIAL
// ========================================
router.get("/", async (req, res) => {
    try {
        const data = await Historial.find({ tipo_producto: "Otros Artes" })
            .sort({ createdAt: -1 })
            .limit(30);

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json([]);
    }
});

export default router;
