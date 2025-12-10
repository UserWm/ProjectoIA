import { Router } from "express";
import { openai } from "../services/chatgpt.service.js";
import Historial from "../models/Historial.js";

const router = Router();

// =========================
//  GENERAR TEXTO AFICHE WEB
// =========================
router.post("/", async (req, res) => {
    try {
        const filtros = req.body;

        const prompt = `
Genera el contenido textual para un AFICHE PUBLICITARIO PARA SITIO WEB.

Datos:
Producto: ${filtros.producto}
Edad objetivo: ${filtros.edad}
Género: ${filtros.genero}
Intereses: ${filtros.intereses}
Objetivo: ${filtros.objetivo}
Estilo visual web: ${filtros.estilo}
Tono del mensaje: ${filtros.tono}

Descripción adicional del producto:
${filtros.descripcion}

Genera:
- Título web llamativo
- Subtítulo breve profesional
- Texto principal (3–4 líneas)
- CTA final orientado a web
- Recomendación de diseño web
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
        });

        const contenido = completion.choices[0].message.content;

        await Historial.create({
            busqueda: JSON.stringify(filtros, null, 2),
            resultado: contenido,
            tipo_producto: "Afiche Web"
        });

        res.json({ ok: true, resultado: contenido });

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Error generando contenido del afiche web" });
    }
});


// =========================
//   GENERAR IMAGEN AFICHE WEB
// =========================
router.post("/imagen", async (req, res) => {
    try {
        const { headline, texto, cta, estilo } = req.body;

        const prompt = `
Diseña un afiche WEB profesional (banner / hero web).

Debe incluir visualmente:
- como encabezado de la imagen ${headline}
- Texto descriptivo o cuerpo del contenido ${texto}
- CTA el llamado a la accion ${cta}

Estilo visual: ${estilo}
Formato: rectangular estilo banner web moderno, colores vibrantes, diseño elegante y profesional.
        `;

        const image = await openai.images.generate({
            model: "gpt-image-1",
            prompt,
            size: "1024x1024"
        });

        // 🚨 Validación correcta para gpt-image-1
        if (!image.data || !image.data[0] || !image.data[0].b64_json) {
            return res.status(500).json({
                ok: false,
                error: "OpenAI no devolvió imagen"
            });
        }

        // Convertir base64 a imagen usable en <img>
        const base64Image = `data:image/png;base64,${image.data[0].b64_json}`;

        res.json({
            ok: true,
            image: base64Image
        });

    } catch (error) {
        console.error("❌ Error OpenAI:", error);
        res.status(500).json({ ok: false, error: error.message });
    }
});


// =========================
//  LISTAR HISTORIAL
// =========================
router.get("/", async (req, res) => {
    try {
        const data = await Historial.find({ tipo_producto: "Afiche Web" })
            .sort({ createdAt: -1 })
            .limit(30);

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json([]);
    }
});

export default router;
