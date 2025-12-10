import { Router } from "express";
import { openai } from "../services/chatgpt.service.js";
import Historial from "../models/Historial.js";

const router = Router();

/* ============================================================
   🔵 GENERAR ESLÓGAN BREVE
   ============================================================ */
router.post("/", async (req, res) => {
    try {
        const filtros = req.body;

        const prompt = `
Genera un eslógan breve, creativo y profesional para un producto.

Datos:
Producto: ${filtros.producto}
Tipo de eslógan: ${filtros.tipo}
Edad objetivo: ${filtros.edad}
Género objetivo: ${filtros.genero}
Intereses del público: ${filtros.intereses}
Objetivo del eslógan: ${filtros.objetivo}

Descripción adicional:
${filtros.descripcion}

Requisitos:
- El eslógan debe ser breve y conciso 
- Debe ser memorable y publicitario
- No agregues explicaciones, solo el eslógan final
- Tomar en cuenta descripcion adicional ${filtros.descripcion}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        });

        const eslogan = completion.choices[0].message.content.trim();

        // Guardar en historial
        await Historial.create({
            busqueda: JSON.stringify(filtros, null, 2),
            resultado: eslogan,
            tipo_producto: "Eslógan"
        });

        res.json({
            ok: true,
            resultado: eslogan
        });

    } catch (error) {
        console.error("Error generando eslógan:", error);
        res.status(500).json({ ok: false, error: "Error generando eslógan" });
    }
});


/* ============================================================
   🔵 LISTAR HISTORIAL
   ============================================================ */
router.get("/", async (req, res) => {
    try {
        const data = await Historial.find({ tipo_producto: "Eslógan" })
            .sort({ createdAt: -1 })
            .limit(40);

        res.json(data);

    } catch (error) {
        console.log("Error mostrando historial:", error);
        res.status(500).json([]);
    }
});

export default router;
