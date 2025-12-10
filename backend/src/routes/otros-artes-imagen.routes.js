import { Router } from "express";
import { openai } from "../services/chatgpt.service.js";

const router = Router();

// ========================================
//  GENERAR IMAGEN PARA OTROS ARTES
// ========================================
router.post("/", async (req, res) => {
    try {
        const { headline, texto, cta, estilo } = req.body;

        const prompt = `
Crea el diseño visual de un arte profesional para marketing digital, no tomar en cuenta lo que va en # o * porque son indicaciones de las partes del arte.

Debe incluir visualmente:
- Título: ${headline}
- Texto corto: ${texto}
- Llamado a la acción: ${cta}

Estilo gráfico: ${estilo}.
Colores llamativos, composición profesional, formato cuadrado 1:1.
Diseñado para redes sociales y anuncios digitales.
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
export default router;
