import { Router } from "express";
import {openai }from "../services/chatgpt.service.js";
import Historial from "../models/Historial.js";


const router = Router();

// GENERAR AFICHE
router.post("/", async (req, res) => {
    try {
        const filtros = req.body;

        const prompt = `
Crea el contenido textual para un afiche profesional para redes sociales.

Datos del producto:
Producto: ${filtros.producto}
Edad objetivo: ${filtros.edad}
Género objetivo: ${filtros.genero}
Intereses: ${filtros.intereses}
Objetivo del anuncio: ${filtros.objetivo}
Estilo visual deseado: ${filtros.estilo}
Ton o comunicacional: ${filtros.tono}

Descripción del producto:
${filtros.descripcion}

Genera:
- Un encabezado impactante (headline)
- Un texto corto secundario
- Un llamado a la acción (CTA)
- Recomendación breve del estilo visual

Formato estilo diseñador gráfico profesional.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const contenido = completion.choices[0].message.content;

        await Historial.create({
            busqueda: JSON.stringify(filtros, null, 2),
            resultado: contenido,
            tipo_producto: "Afiches para redes sociales"
        });

        res.json({
            ok: true,
            resultado: contenido
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Error generando afiche" });
    }
});

export default router;
